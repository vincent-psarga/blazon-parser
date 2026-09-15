import { describe, expect, test } from 'vitest';
import { VariationType } from '../../domain/models/Field';
import { OrdinaryType } from '../../domain/models/Ordinary';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { WikipediaColours } from '../../infra/colours/WikipediaColours';
import { SvgBlazonDrawer } from './SvgBlazonDrawer';

/**
 * A field blazoned in six pieces has to be drawn in six, which is a thing about
 * the drawing rather than about any number in it: a piece may be laid perfectly
 * correctly and still fall where the shield is not.
 *
 * So the drawing is read back as a reader sees it. The shield is taken from the
 * clip path the drawer wrote, filled in as a grid of points, and each of those
 * points is asked which piece covers it — nothing here is told where the pieces
 * were meant to go, only where the shield is and what was drawn on it.
 */
type Point = readonly [x: number, y: number];
type Polygon = readonly Point[];

const drawer = new SvgBlazonDrawer(WikipediaColours);

const drawn = (type: VariationType, pieces: number) =>
  drawer.draw({
    field: { type, firstTincture: Metals.argent, secondTincture: Colours.gules, pieces },
  });

/** A cubic curve, as the path writes one, sampled closely enough to fill in. */
function curve(from: Point, first: Point, second: Point, to: Point): Polygon {
  return Array.from({ length: 24 }, (_, step) => {
    const t = (step + 1) / 24;
    const u = 1 - t;
    const at = (start: number, one: number, two: number, end: number) =>
      u ** 3 * start + 3 * u * u * t * one + 3 * u * t * t * two + t ** 3 * end;
    return [
      at(from[0], first[0], second[0], to[0]),
      at(from[1], first[1], second[1], to[1]),
    ] as const;
  });
}

/**
 * The shield the drawing clips to, as a closed run of points.
 *
 * Only the commands this one path uses are read — a move, a horizontal and a
 * vertical run, two curves and a close — because reading a whole path grammar
 * to check one shield would be a second drawer to get wrong.
 */
function shieldOf(svg: string): Polygon {
  const path = /<clipPath[^>]*><path d="([^"]+)"/.exec(svg)?.[1];
  expect(path).toBeDefined();
  const numbers = (from: string) => from.trim().split(/[ ,]+/).map(Number);
  const points: Point[] = [];
  let at: Point = [0, 0];
  for (const step of (path as string).matchAll(/([MHVCZ])([^MHVCZ]*)/g)) {
    const [command, rest] = [step[1], step[2]];
    if (command === 'M') {
      const [x, y] = numbers(rest);
      at = [x, y];
      points.push(at);
    } else if (command === 'H') {
      at = [numbers(rest)[0], at[1]];
      points.push(at);
    } else if (command === 'V') {
      at = [at[0], numbers(rest)[0]];
      points.push(at);
    } else if (command === 'C') {
      const [x1, y1, x2, y2, x, y] = numbers(rest);
      const sampled = curve(at, [x1, y1], [x2, y2], [x, y]);
      points.push(...sampled);
      at = [x, y];
    }
  }
  return points;
}

/** Every shape laid over the field, in the order it was laid, as polygons. */
function piecesOf(svg: string): readonly Polygon[] {
  const arms = svg.slice(svg.indexOf('<g clip-path'), svg.indexOf('</g>'));
  const shapes: Polygon[] = [];
  for (const rect of arms.matchAll(
    /<rect x="(-?[\d.]+)" y="(-?[\d.]+)" width="(-?[\d.]+)" height="(-?[\d.]+)"/g
  )) {
    const [x, y, width, height] = rect.slice(1).map(Number);
    shapes.push([
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
    ]);
  }
  for (const polygon of arms.matchAll(/<polygon points="([^"]+)"/g)) {
    shapes.push(
      polygon[1]
        .trim()
        .split(' ')
        .map((pair) => pair.split(',').map(Number) as unknown as Point)
    );
  }
  return shapes;
}

/** Whether a point lies within a shape, by counting the crossings to its left. */
function within(shape: Polygon, [x, y]: Point): boolean {
  let inside = false;
  for (let edge = 0, last = shape.length - 1; edge < shape.length; last = edge, edge += 1) {
    const [x1, y1] = shape[edge];
    const [x2, y2] = shape[last];
    if (y1 > y !== y2 > y && x < x1 + ((y - y1) / (y2 - y1)) * (x2 - x1)) {
      inside = !inside;
    }
  }
  return inside;
}

/** Every point of the shield, taken close enough together to catch a sliver. */
function fieldOf(svg: string): readonly Point[] {
  const shield = shieldOf(svg);
  const points: Point[] = [];
  for (let x = 0; x < 200; x += 1) {
    for (let y = 0; y < 240; y += 1) {
      if (within(shield, [x + 0.5, y + 0.5])) {
        points.push([x + 0.5, y + 0.5]);
      }
    }
  }
  return points;
}

/** How much of the shield each piece covers, and how much of it is left bare. */
function covering(svg: string): { readonly pieces: readonly number[]; readonly field: number } {
  const laid = piecesOf(svg);
  const covered = laid.map(() => 0);
  let bare = 0;
  for (const point of fieldOf(svg)) {
    const piece = laid.findIndex((shape) => within(shape, point));
    if (piece === -1) {
      bare += 1;
    } else {
      covered[piece] += 1;
    }
  }
  return { pieces: covered, field: bare };
}

const COUNTS = [2, 4, 6, 8, 10];

describe('every piece a blazon counts is drawn on the shield', () => {
  test.each(Object.values(VariationType).flatMap((type) => COUNTS.map((pieces) => [type, pieces])))(
    'a %s of %i shows every piece',
    (type, pieces) => {
      const covered = covering(drawn(type as VariationType, pieces as number));
      // Half the pieces are laid over the field and the other half are the field
      // itself, so both the laid ones and what is left bare have to show.
      expect(covered.pieces).toHaveLength((pieces as number) / 2);
      expect(covered.pieces.every((points) => points > 0)).toBe(true);
      expect(covered.field).toBeGreaterThan(0);
    }
  );

  test('draws the six pieces of a bendy of six, the last of them and all', () => {
    // The piece that used to go missing: measured across the drawing rather than
    // across the shield, the lowest diagonal fell where a square shield would
    // have its corner and a heater has only its point, and six read as five.
    const covered = covering(drawn(VariationType.bendy, 6));
    expect(covered.pieces).toHaveLength(3);
    for (const points of covered.pieces) {
      expect(points).toBeGreaterThan(100);
    }
  });

  test('leaves no piece of a paly so thin that a reader would miss it under a bordure', () => {
    // A bordure is laid over the field and covers the outer piece of it, which is
    // what an armorial draws — the Burgundy bendy is drawn that way. What it must
    // not leave is a thread: the piece has to be read as a piece.
    const svg = drawer.draw({
      field: {
        type: VariationType.paly,
        firstTincture: Metals.or,
        secondTincture: Colours.azure,
        pieces: 6,
      },
      ordinaries: [{ type: OrdinaryType.bordure, tincture: Colours.gules }],
    });

    // A bordure is the shield's own outline stroked thickly and clipped to
    // itself, so it reaches half its width inside the edge.
    const stroked = /stroke-width="(\d+)"/.exec(
      svg.slice(svg.indexOf('<g clip-path'), svg.indexOf('</g>'))
    );
    const reaches = Number(stroked?.[1]) / 2;
    const dexter = Math.min(...shieldOf(svg).map(([x]) => x));
    const [firstPiece] = piecesOf(svg);
    const laidAt = Math.min(...firstPiece.map(([x]) => x));

    // What is left of the first piece is the field between the bordure's inner
    // edge and the second piece, which is the one laid over first.
    expect(laidAt - (dexter + reaches)).toBeGreaterThanOrEqual(5);
  });
});
