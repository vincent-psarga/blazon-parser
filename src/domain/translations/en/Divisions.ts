import { DivisionType, FieldType } from '../../models/Field';
import { parker } from '../Sources';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English names a partition after the line that divides the field, as French
// does, but spells it out: "per pale" where French says "parti".
export const EnglishDivisionType: Translation<DivisionType> = {
  [FieldType.pale]: new Word('per pale', {
    value:
      'The field cut straight down the middle, along the line a pale would occupy. The first tincture named takes the half at dexter, the viewer’s left.',
    sources: [parker('Party')],
  }),
  [FieldType.fess]: new Word('per fess', {
    value:
      'The field cut straight across, along the line of a fess. The first tincture named takes the chief, the upper half.',
    sources: [parker('Party')],
  }),
  [FieldType.bend]: new Word('per bend', {
    value:
      'Cut from dexter chief to sinister base — from the top left, as you look at it — along the line of a bend.',
    sources: [parker('Party')],
  }),
  [FieldType.bendSinister]: new Word('per bend sinister', {
    value:
      'Cut from sinister chief to dexter base — from the top right, as you look at it — along the line of a bend sinister. Sinister means the bearer’s left, never yours.',
    sources: [parker('Party')],
  }),
};
