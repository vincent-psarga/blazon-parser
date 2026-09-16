import { Frame, Ink, Painter } from '../Ground';
import { Shape } from '../shapes/Shape';

/**
 * The ground cut in two along a line, each half in an ink of its own.
 *
 * The halves are drawn past the edges they meet and left to the clip path, so
 * the line keeps its own angle instead of being fitted to whatever curve the
 * frame has.
 */
export const split =
  (halves: (frame: Frame) => readonly [Shape, Shape], first: Ink, second: Ink): Painter =>
  (ground) => {
    const [inChief, inBase] = halves(ground.frame);
    return inChief(first(ground)) + inBase(second(ground));
  };
