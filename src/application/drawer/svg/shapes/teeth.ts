import { Shape } from './Shape';
import { polygon } from './polygon';

/** A corner of a line, or of the outline of something. */
export type Point = readonly [x: number, y: number];

/**
 * How far apart the points of an indented line stand, measured along the line,
 * and how far the teeth reach across it.
 *
 * Indented is the small-toothed line — "notched after the manner of dancetty,
 * but with smaller teeth" — so the tooth is fixed rather than reckoned off what
 * is being cut: a fess, a bend and the edge of the shield are cut with the same
 * teeth, which is what makes the line recognisable wherever it is drawn. Half a
 * dozen of them cross the field, which is what the armorials draw and what the
 * dancetty would have three of.
 */
const TOOTH = 20;
const BITE = 10;

/** The two ways a tooth reaches from a line that runs flat, or from one that stands. */
export const DOWNWARD: Point = [0, BITE];
export const SIDEWAYS: Point = [BITE, 0];

/**
 * The way a tooth reaches when it is cut square to the line it is cut in, which
 * is what a line running neither flat nor upright needs.
 *
 * A diagonal band's own width is measured across the field rather than square to
 * itself, so teeth reckoned the same way would lie along the field and read as
 * steps rather than as teeth. Both edges are pushed alike whichever way is
 * chosen, so the band keeps its width either way; this is the way that looks
 * like the line it is.
 */
export const square = ([fromX, fromY]: Point, [toX, toY]: Point): Point => {
  const run = Math.hypot(toX - fromX, toY - fromY);
  return [(-(toY - fromY) * BITE) / run, ((toX - fromX) * BITE) / run];
};

/**
 * A line run in teeth rather than straight: every other point along it pushed
 * half a tooth one way and the rest half a tooth the other, so that the teeth
 * stand about the line the band would have had rather than to one side of it.
 *
 * The line is given as the corners it turns, so that a band bent to a point is
 * cut along both its limbs and keeps its point: each limb is cut into an even
 * number of steps, which leaves every corner on the line it was on and lets the
 * teeth carry on past it without a half tooth at the bend.
 *
 * How the tooth reaches is handed in rather than reckoned square to the line,
 * because a band's own width may be measured that way: a bend is drawn by
 * sliding its edges sideways, so its teeth are cut sideways too, and the band
 * keeps the width it would have had.
 */
export function toothed(line: readonly Point[], [biteX, biteY]: Point): readonly Point[] {
  const cut: Point[] = [];
  for (let corner = 1; corner < line.length; corner += 1) {
    const [fromX, fromY] = line[corner - 1];
    const [toX, toY] = line[corner];
    const teeth = Math.max(1, Math.round(Math.hypot(toX - fromX, toY - fromY) / (2 * TOOTH)));
    const points = 2 * teeth;
    for (let point = corner === 1 ? 0 : 1; point <= points; point += 1) {
      const along = point / points;
      cut.push([
        fromX + (toX - fromX) * along + biteX * pushed(point),
        fromY + (toY - fromY) * along + biteY * pushed(point),
      ]);
    }
  }
  return cut;
}

/** Which side of the line a point of it is pushed to, the teeth alternating. */
function pushed(point: number): number {
  return point % 2 === 0 ? -1 / 2 : 1 / 2;
}
/**
 * A band that follows an outline, with its inner edge cut into teeth: how deep
 * the plain band beneath the teeth runs, and the teeth standing on it.
 *
 * This is what a band following the edge of the shield needs and no band
 * crossing the field does. The outer edge of such a band is the outline itself
 * and is not the band's to cut, so the teeth are all on the one side, and the
 * band is deeper where a tooth reaches and shallower where a notch does. That is
 * how the armorials draw it; every other indented band keeps its width, both its
 * edges being free.
 *
 * It comes back as a band and a row of teeth rather than as one outline, because
 * an outline brought inside a corner crosses itself there — the two sides reach
 * past one another — and a crossing is a hole in anything painted by the even-odd
 * rule. Teeth laid on a band can only add paint, so the corner is left to the
 * band, which is a stroke and miters its own corners, and no arithmetic here has
 * to know what a corner is.
 *
 * Each tooth is set a little way into the band rather than stood on top of it. A
 * tooth stands on a straight line between two points of the outline, and where
 * the outline curves that line falls inside the band's own edge — by a couple of
 * hairs on the curve of a shield's base, which is enough for the field to show
 * between the band and its teeth. So the tooth reaches back past where the band
 * ends, which changes nothing about the part of it that shows.
 *
 * The teeth are counted round the whole outline and spaced by the length of it,
 * so that they come out even wherever it is measured from: a line that closes on
 * itself has no end to leave a half tooth at, and an odd count would set a tooth
 * against a tooth where it came round.
 *
 * Which way is inwards is read off the outline rather than assumed: a frame is
 * free to be drawn either way round, and a guess would set the teeth outside the
 * shield.
 */
export interface Toothed {
  /** How deep the band the teeth stand on runs, which is shallower than the whole. */
  readonly beneath: number;
  /** The teeth, each a triangle standing on that band and reaching a bite deeper. */
  readonly teeth: readonly Shape[];
}

/** How far back into the band a tooth reaches, which is more than any curve of it. */
const ROOT = BITE / 2;

export function toothedInside(outline: readonly Point[], depth: number): Toothed {
  const walked = walking(outline);
  const count = Math.max(1, Math.round(walked.length / (2 * TOOTH)));
  const points = 2 * count;
  const inward = turning(outline);
  const beneath = depth - BITE / 2;
  const at = (point: number, deep: number): Point => {
    const [[x, y], [alongX, alongY]] = walked.at((point * walked.length) / points);
    return [x - inward * alongY * deep, y + inward * alongX * deep];
  };
  return {
    beneath,
    teeth: Array.from({ length: count }, (_, tooth) =>
      polygon(
        pointsOf([
          at(2 * tooth, beneath),
          at(2 * tooth + 1, beneath + BITE),
          at(2 * tooth + 2, beneath),
          at(2 * tooth + 1, beneath - ROOT),
        ])
      )
    ),
  };
}

/** An outline written as a polygon's points, which is how a band is painted. */
export function pointsOf(outline: readonly Point[]): string {
  return outline.map(([x, y]) => `${round(x)},${round(y)}`).join(' ');
}

/** Whole numbers where the drawing allows them, and a tenth where it does not. */
function round(measure: number): number {
  return Math.round(measure * 10) / 10;
}

/** An outline measured, so that any distance round it can be asked for. */
interface Walked {
  /** How far it is round the whole of it. */
  readonly length: number;
  /** Where a given distance round it falls, and which way the line runs there. */
  readonly at: (distance: number) => readonly [Point, Point];
}

/**
 * An outline measured once so that it can be walked many times.
 *
 * What comes back at each distance is the place and the way the line runs there,
 * because a line is cut square to itself and the only thing that knows which way
 * square is, is the line.
 */
function walking(outline: readonly Point[]): Walked {
  const reached: number[] = [0];
  for (let corner = 1; corner <= outline.length; corner += 1) {
    const [fromX, fromY] = outline[corner - 1];
    const [toX, toY] = outline[corner % outline.length];
    reached.push(reached[corner - 1] + Math.hypot(toX - fromX, toY - fromY));
  }
  const length = reached[outline.length];
  return {
    length,
    at: (distance) => {
      const gone = ((distance % length) + length) % length;
      const corner = Math.max(0, reached.findIndex((reached) => reached > gone) - 1);
      const [fromX, fromY] = outline[corner];
      const [toX, toY] = outline[(corner + 1) % outline.length];
      const run = Math.hypot(toX - fromX, toY - fromY) || 1;
      const along = (gone - reached[corner]) / run;
      return [
        [fromX + (toX - fromX) * along, fromY + (toY - fromY) * along],
        [(toX - fromX) / run, (toY - fromY) / run],
      ];
    },
  };
}

/**
 * Which way round an outline is drawn, as the sign to turn its own direction by
 * to face inwards.
 *
 * Twice the area it encloses, which comes out positive one way round and
 * negative the other. A shape is drawn whichever way its author drew it, and
 * nothing here may assume one.
 */
function turning(outline: readonly Point[]): number {
  let twiceTheArea = 0;
  for (let corner = 0; corner < outline.length; corner += 1) {
    const [fromX, fromY] = outline[corner];
    const [toX, toY] = outline[(corner + 1) % outline.length];
    twiceTheArea += fromX * toY - toX * fromY;
  }
  return twiceTheArea >= 0 ? 1 : -1;
}
