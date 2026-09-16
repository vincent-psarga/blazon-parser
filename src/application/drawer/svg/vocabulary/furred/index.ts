import { FurType } from '../../../../../domain/models/Field';
import { FurredFigure } from '../Figures';
import { vairy } from './vairy';

/**
 * The pelt each furred field is covered with. Being keyed on FurType, a fur
 * added to the vocabulary breaks this until it is given one.
 */
export const FURRED: Record<FurType, FurredFigure> = {
  [FurType.vairy]: vairy,
};
