import { alternate } from '../../painting/arrange';
import { RISE, bent } from '../../shapes/bands';
import { VariationFigure } from '../Figures';

/**
 * The chevron repeated.
 *
 * A chevron reaches as far below its point as the field is wide either side of
 * it, so the points run from a rise above the top of the field to its foot, and
 * the pieces share that room rather than the height alone.
 */
export const chevronny: VariationFigure = {
  pieces: (frame, pieces) =>
    alternate(pieces, frame.top - RISE, frame.base - frame.top + RISE).map(bent(frame)),
};
