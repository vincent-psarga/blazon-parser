import { ChargeType } from '../../../../../domain/models/Charge';
import { ChargeFigure } from '../Figures';
import { annulet } from './annulet';
import { billet } from './billet';
import { lozenge } from './lozenge';
import { roundel } from './roundel';

/**
 * The shape each charge is drawn as, wherever it is put: at the places and the
 * size a count was given, or sown small over the whole field.
 *
 * Being keyed on ChargeType, a charge added to the vocabulary breaks this until
 * it is given a shape.
 */
export const CHARGES: Record<ChargeType, ChargeFigure> = {
  [ChargeType.annulet]: annulet,
  [ChargeType.billet]: billet,
  [ChargeType.lozenge]: lozenge,
  [ChargeType.roundel]: roundel,
};
