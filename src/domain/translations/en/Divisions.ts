import { DivisionType, FieldType } from '../../models/Field';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English names a partition after the line that divides the field, as French
// does, but spells it out: "per pale" where French says "parti".
export const EnglishDivisionType: Translation<DivisionType> = {
  [FieldType.pale]: new Word(
    'per pale',
    'The field cut straight down the middle, along the line a pale would occupy. The first tincture named takes the half at dexter, the viewer’s left.'
  ),
  [FieldType.fess]: new Word(
    'per fess',
    'The field cut straight across, along the line of a fess. The first tincture named takes the chief, the upper half.'
  ),
  [FieldType.bend]: new Word(
    'per bend',
    'Cut from dexter chief to sinister base — from the top left, as you look at it — along the line of a bend.'
  ),
  [FieldType.bendSinister]: new Word(
    'per bend sinister',
    'Cut from sinister chief to dexter base — from the top right, as you look at it — along the line of a bend sinister. Sinister means the bearer’s left, never yours.'
  ),
};
