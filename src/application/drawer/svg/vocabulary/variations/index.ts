import { VariationType } from '../../../../../domain/models/Field';
import { VariationFigure } from '../Figures';
import { barry } from './barry';
import { bendy } from './bendy';
import { chevronny } from './chevronny';
import { paly } from './paly';
import { pily } from './pily';

/**
 * The pieces each varied field lays over itself, given how many it is cut into.
 *
 * Every one is drawn past the edges it meets and left to the clip path, as the
 * ordinaries are. Being keyed on VariationType, a varied field added to the
 * vocabulary breaks this until it is given a shape.
 */
export const VARIATIONS: Record<VariationType, VariationFigure> = {
  [VariationType.barry]: barry,
  [VariationType.paly]: paly,
  [VariationType.bendy]: bendy,
  [VariationType.pily]: pily,
  [VariationType.chevronny]: chevronny,
};
