import { ChargeType } from '../../../../../domain/models/Charge';
import { BorneFigure } from '../Figures';
import { annulet } from './annulet';
import { billet } from './billet';
import { lozenge } from './lozenge';
import { roundel } from './roundel';

/**
 * The shape each charge is drawn as, at the places and the size its count was
 * given.
 *
 * Being keyed on ChargeType, a charge added to the vocabulary breaks this until
 * it is given a shape.
 */
export const CHARGES: Record<ChargeType, BorneFigure> = {
  [ChargeType.annulet]: annulet,
  [ChargeType.billet]: billet,
  [ChargeType.lozenge]: lozenge,
  [ChargeType.roundel]: roundel,
};
