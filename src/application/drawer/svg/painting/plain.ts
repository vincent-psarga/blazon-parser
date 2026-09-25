import { Ink, Painter } from '../Ground';
import { filled } from '../shapes/path';

/**
 * The whole of the ground, in one ink.
 *
 * Alone among the paintings it is not outlined, having nothing to be told apart
 * from: it covers the frame entire, and the frame's own outline is already
 * drawn round the whole drawing.
 */
export const plain =
  (ink: Ink): Painter =>
  (ground) =>
    filled(ground.frame.path)({ fill: ink(ground) });
