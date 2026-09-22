import { Frame } from '../Ground';
import { Shape, all } from './Shape';
import { polygon } from './polygon';
import { rectangle } from './rectangle';
import { DOWNWARD, Point, SIDEWAYS, pointsOf, square, toothed } from './teeth';

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

/**
 * A band whose two edges are cut into teeth: the line it is drawn along, the way
 * across to its other edge, and the way the teeth reach.
 *
 * Both edges are cut alike and in step, so the band keeps the width it had — it
 * is the line the band follows that was modified, not the band's size — and what
 * is drawn is one ribbon of teeth rather than a row of triangles.
 */
const toothedBand = (line: readonly Point[], [acrossX, acrossY]: Point, bite: Point): Shape =>
  polygon(
    pointsOf([
      ...toothed(line, bite),
      ...[
        ...toothed(
          line.map(([x, y]): Point => [x + acrossX, y + acrossY]),
          bite
        ),
      ].reverse(),
    ])
  );

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
