import { spaced } from '../../painting/arrange';
import { inBendSinister } from '../../shapes/bands';
import { BorneFigure } from '../Figures';
import { DIAGONALS } from './bend';

/** The mirror of a bend, from sinister chief. */
export const bendSinister: BorneFigure = {
  shapes: (frame, count) => spaced(count, -DIAGONALS / 2, DIAGONALS).map(inBendSinister(frame)),
};
