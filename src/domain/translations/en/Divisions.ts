import { DivisionType } from '../../models/Field';
import { Translation } from '../Translation';

// English names a partition after the line that divides the field, as French
// does, but spells it out: "per pale" where French says "parti".
export const EnglishDivisionType: Translation<DivisionType> = {
  [DivisionType.pale]: 'per pale',
  [DivisionType.fess]: 'per fess',
  [DivisionType.bend]: 'per bend',
  [DivisionType.bendSinister]: 'per bend sinister',
};
