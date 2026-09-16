import { Frame, Ink, Painter } from '../Ground';
import { Shape, all } from '../shapes/Shape';

/**
 * Shapes laid over the ground, every one of them in the one ink: three billets
 * are three shapes of one paint, as three bends are three bands of one.
 */
export const laid =
  (shapes: (frame: Frame) => readonly Shape[], ink: Ink): Painter =>
  (ground) =>
    all(shapes(ground.frame))(ink(ground));
