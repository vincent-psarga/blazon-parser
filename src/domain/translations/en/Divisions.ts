import { DivisionType } from '../../models/Field';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English names a partition after the line that divides the field, as French
// does, but spells it out: "per pale" where French says "parti".
export const EnglishDivisionType: Translation<DivisionType> = {
  [DivisionType.pale]: new Word('per pale'),
  [DivisionType.fess]: new Word('per fess'),
  [DivisionType.bend]: new Word('per bend'),
  [DivisionType.bendSinister]: new Word('per bend sinister'),
};
