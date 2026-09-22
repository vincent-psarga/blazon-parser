import { Frame } from '../Ground';
import { Shape, all } from './Shape';
import { polygon } from './polygon';
import { rectangle } from './rectangle';

/** A band's place across the room it crosses: where it begins, and how far it runs. */
export type Band = readonly [at: number, across: number];

/** A band straight across the frame. */
export const across =
  (frame: Frame) =>
  ([at, span]: Band): Shape =>
    rectangle(0, at, frame.width, span);

/** A band straight down the frame. */
export const down =
  (frame: Frame) =>
  ([at, span]: Band): Shape =>
    rectangle(at, 0, span, frame.height);

/**
 * A band running corner to corner, given where it cuts the top edge.
 *
 * Its width is measured across the frame rather than square to the band: the
 * diagonal is drawn by sliding the top and bottom edges sideways, which keeps
 * the arithmetic in whole numbers.
 */
export const inBend =
  ({ width, height }: Frame) =>
  ([at, span]: Band): Shape =>
    polygon(`${at},0 ${at + span},0 ${width + at + span},${height} ${width + at},${height}`);

export const inBendSinister =
  ({ width, height }: Frame) =>
  ([at, span]: Band): Shape =>
    polygon(`${width + at},0 ${width + at + span},0 ${at + span},${height} ${at},${height}`);

/** How far a bent band's limbs climb from the edge of the frame to its point. */
export const RISE = 100;

/** A band bent to a point, given where its upper edge reaches that point. */
export const bent =
  ({ width }: Frame) =>
  ([at, span]: Band): Shape =>
    polygon(
      `0,${at + RISE} ${width / 2},${at} ${width},${at + RISE} ` +
        `${width},${at + RISE + span} ${width / 2},${at + span} 0,${at + RISE + span}`
    );

/** How much of a twinned band's room is bar rather than the gap between the pair. */
const BAR_OF_THE_PAIR = 3 / 8;

/**
 * A pair of narrow bars in the room one band would have taken: three parts bar,
 * two parts field, three parts bar.
 *
 * The gap inside the pair is narrower than the field left around it, which is
 * what makes the two read as one thing rather than as two bars that happen to
 * lie close together.
 */
export const twinned =
  (frame: Frame) =>
  ([at, span]: Band): Shape => {
    const bar = Math.round(span * BAR_OF_THE_PAIR);
    return all([
      rectangle(0, at, frame.width, bar),
      rectangle(0, at + span - bar, frame.width, bar),
    ]);
  };

/** A corner of a band's outline. */
type Point = readonly [x: number, y: number];

/**
 * How far apart the points of an indented line stand, measured along the line,
 * and how far the teeth reach across it.
 *
 * Indented is the small-toothed line — "notched after the manner of dancetty,
 * but with smaller teeth" — so the tooth is fixed rather than reckoned off the
 * band: a fess and a bend are cut with the same teeth, which is what makes the
 * line recognisable wherever it is drawn. Half a dozen of them cross the field,
 * which is what the armorials draw and what the dancetty would have three of.
 */
const TOOTH = 20;
const BITE = 10;

/** The two ways a tooth reaches from a band that runs flat, or from one that stands. */
const DOWNWARD: Point = [0, BITE];
const SIDEWAYS: Point = [BITE, 0];

/**
 * The way a tooth reaches when it is cut square to the line it is cut in, which
 * is what a line running neither flat nor upright needs.
 *
 * A diagonal's own width is measured across the field rather than square to
 * itself, so teeth reckoned the same way would lie along the field and read as
 * steps rather than as teeth. Both edges are pushed alike whichever way is
 * chosen, so the band keeps its width either way; this is the way that looks
 * like the line it is.
 */
const square = ([fromX, fromY]: Point, [toX, toY]: Point): Point => {
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
 * because a band's own width is measured that way here: a bend is drawn by
 * sliding its edges sideways, so its teeth are cut sideways too, and the band
 * keeps the width it would have had.
 */
function toothed(line: readonly Point[], [biteX, biteY]: Point): readonly Point[] {
  const cut: Point[] = [];
  const pushed = (point: number): number => (point % 2 === 0 ? -1 / 2 : 1 / 2);
  for (let corner = 1; corner < line.length; corner += 1) {
    const [fromX, fromY] = line[corner - 1];
    const [toX, toY] = line[corner];
    const teeth = Math.max(1, Math.round(Math.hypot(toX - fromX, toY - fromY) / (2 * TOOTH)));
    const points = 2 * teeth;
    const from = corner === 1 ? 0 : 1;
    for (let point = from; point <= points; point += 1) {
      const along = point / points;
      cut.push([
        fromX + (toX - fromX) * along + biteX * pushed(point),
        fromY + (toY - fromY) * along + biteY * pushed(point),
      ]);
    }
  }
  return cut;
}

/**
 * A band whose two edges are cut into teeth: the line it is drawn along, the way
 * across to its other edge, and the way the teeth reach.
 *
 * Both edges are cut alike and in step, so the band keeps the width it had — it
 * is the line the band follows that was modified, not the band's size — and what
 * is drawn is one ribbon of teeth rather than a row of triangles.
 */
const toothedBand = (line: readonly Point[], [acrossX, acrossY]: Point, bite: Point): Shape => {
  const near = toothed(line, bite);
  const far = toothed(
    line.map(([x, y]): Point => [x + acrossX, y + acrossY]),
    bite
  );
  return polygon(
    [...near, ...[...far].reverse()].map(([x, y]) => `${round(x)},${round(y)}`).join(' ')
  );
};

/** Whole numbers where the drawing allows them, and a tenth where it does not. */
function round(measure: number): number {
  return Math.round(measure * 10) / 10;
}

/** A band straight across the frame, its edges cut into teeth. */
export const acrossIndented =
  (frame: Frame) =>
  ([at, span]: Band): Shape =>
    toothedBand(
      [
        [0, at],
        [frame.width, at],
      ],
      [0, span],
      DOWNWARD
    );

/** A band straight down the frame, its edges cut into teeth. */
export const downIndented =
  (frame: Frame) =>
  ([at, span]: Band): Shape =>
    toothedBand(
      [
        [at, 0],
        [at, frame.height],
      ],
      [span, 0],
      SIDEWAYS
    );

/** A band corner to corner, its edges cut into teeth square to its own slant. */
export const inBendIndented =
  ({ width, height }: Frame) =>
  ([at, span]: Band): Shape =>
    diagonal([at, 0], [width + at, height], span);

export const inBendSinisterIndented =
  ({ width, height }: Frame) =>
  ([at, span]: Band): Shape =>
    diagonal([width + at, 0], [at, height], span);

/** A band running from one corner of the frame towards another, cut into teeth. */
const diagonal = (from: Point, to: Point, span: number): Shape =>
  toothedBand([from, to], [span, 0], square(from, to));

/** A band bent to a point, its edges cut into teeth along both limbs. */
export const bentIndented =
  ({ width }: Frame) =>
  ([at, span]: Band): Shape =>
    toothedBand(
      [
        [0, at + RISE],
        [width / 2, at],
        [width, at + RISE],
      ],
      [0, span],
      DOWNWARD
    );
