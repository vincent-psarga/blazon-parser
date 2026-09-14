import { DivisionType } from '../../models/Field';
import { Translation } from '../Translation';

// Each partition is named after the line that divides the field.
export const FrenchDivisionType: Translation<DivisionType> = {
  [DivisionType.pale]: 'parti',
  [DivisionType.fess]: 'coupé',
  [DivisionType.bend]: 'tranché',
  [DivisionType.bendSinister]: 'taillé',
};
