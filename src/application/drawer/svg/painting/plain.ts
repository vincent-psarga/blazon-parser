import { Ink, Painter } from '../Ground';
import { filled } from '../shapes/path';

/** The whole of the ground, in one ink. */
export const plain =
  (ink: Ink): Painter =>
  (ground) =>
    filled(ground.frame.path)(ink(ground));
