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
