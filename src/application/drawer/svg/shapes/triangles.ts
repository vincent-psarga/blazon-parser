import { Frame } from '../Ground';
import { Band } from './bands';
import { Shape } from './Shape';
import { polygon } from './polygon';

/**
 * A long triangle driven into the frame from its foot, point upwards, given
 * where its base lies along that foot.
 *
 * Turned over it is the same triangle driven down from the top edge, and two
 * ranks of them driven into each other are what a pily field is.
 */
export const fromBase =
  ({ height }: Frame) =>
  ([at, span]: Band): Shape =>
    polygon(`${at},${height} ${at + Math.round(span / 2)},0 ${at + span},${height}`);
