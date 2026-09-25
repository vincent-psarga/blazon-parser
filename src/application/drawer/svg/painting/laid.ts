import { Frame, Ink, Painter } from '../Ground';
import { Shape } from '../shapes/Shape';
import { inked } from './inked';

/**
 * Shapes laid over the ground, every one of them in the one ink: three billets
 * are three shapes of one paint, as three bends are three bands of one.
 */
export const laid =
  (shapes: (frame: Frame) => readonly Shape[], ink: Ink): Painter =>
  (ground) =>
    inked(shapes(ground.frame), ink)(ground);
