import { FurType } from '../../../../../domain/models/Field';
import { escapeAttribute } from '../../escaping';
import { FurredFigure } from '../Figures';

/**
 * The bells of vair, cut from whatever two tinctures a blazon names rather than
 * from the argent and azure vair itself is always drawn in.
 *
 * The cutting belongs to the colouring rather than to the drawer, because only
 * the colouring knows what its tinctures are made of: a hatched shield cuts the
 * bells out of ruling where a coloured one cuts them out of colour.
 */
export const vairy: FurredFigure = {
  ink:
    (first, second) =>
    ({ colours }) =>
      escapeAttribute(colours.cut(FurType.vairy, first, second).fill),
};
