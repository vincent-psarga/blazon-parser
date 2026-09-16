import { alternate } from '../../painting/arrange';
import { across } from '../../shapes/bands';
import { VariationFigure } from '../Figures';

/** The fess repeated: a row of stripes across the field. */
export const barry: VariationFigure = {
  pieces: (frame, pieces) =>
    alternate(pieces, frame.top, frame.base - frame.top).map(across(frame)),
};
