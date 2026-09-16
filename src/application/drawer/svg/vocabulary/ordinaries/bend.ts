import { spaced } from '../../painting/arrange';
import { inBend } from '../../shapes/bands';
import { BorneFigure } from '../Figures';

/**
 * The room the diagonals share, measured across the top edge of the field. It is
 * wider than the field because a diagonal crosses it at a slant: a single bend
 * takes the middle third of this, which is the third of the field it should be.
 */
export const DIAGONALS = 240;

/** A band from dexter chief to sinister base. */
export const bend: BorneFigure = {
  shapes: (frame, count) => spaced(count, -DIAGONALS / 2, DIAGONALS).map(inBend(frame)),
};
