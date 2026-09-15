import { DivisionType } from '../../models/Field';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

// Each partition is named after the line that divides the field.
export const FrenchDivisionType: Translation<DivisionType, FrenchWord> = {
  [DivisionType.pale]: new FrenchWord('parti'),
  [DivisionType.fess]: new FrenchWord('coupé'),
  [DivisionType.bend]: new FrenchWord('tranché'),
  [DivisionType.bendSinister]: new FrenchWord('taillé'),
};
