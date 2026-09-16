import { alternate } from '../../painting/arrange';
import { down } from '../../shapes/bands';
import { VariationFigure } from '../Figures';

/** The pale repeated: a row of stripes down the field. */
export const paly: VariationFigure = {
  pieces: (frame, pieces) =>
    alternate(pieces, frame.dexter, frame.sinister - frame.dexter).map(down(frame)),
};
