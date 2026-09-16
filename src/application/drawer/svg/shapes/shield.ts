import { Frame } from '../Ground';

const WIDTH = 200;
const HEIGHT = 240;

/** A heater shield, inset far enough that its own outline is not clipped away. */
const SHIELD = 'M6 6 H194 V128 C194 186 150 220 100 234 C50 220 6 186 6 128 Z';

/**
 * The frame a whole coat of arms is drawn in.
 *
 * The first four reaches are the path's own numbers. The last two are the
 * furthest a line in bend can be pushed either way and still cross the shield,
 * which the curve of the base decides rather than any corner.
 */
export const SHIELD_FRAME: Frame = {
  width: WIDTH,
  height: HEIGHT,
  path: SHIELD,
  top: 6,
  base: 234,
  dexter: 6,
  sinister: 194,
  bendFrom: -131,
  bendTo: 189,
};
