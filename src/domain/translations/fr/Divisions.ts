import { DivisionType } from '../../models/Field';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

// Each partition is named after the line that divides the field.
export const FrenchDivisionType: Translation<DivisionType, FrenchWord> = {
  [DivisionType.pale]: new FrenchWord(
    'parti',
    'The field cut straight down the middle, along the line a pal would occupy. The first tincture named takes the half at dexter, the viewer’s left.'
  ),
  [DivisionType.fess]: new FrenchWord(
    'coupé',
    'The field cut straight across, along the line of a fasce. The first tincture named takes the chief, the upper half.'
  ),
  [DivisionType.bend]: new FrenchWord(
    'tranché',
    'Cut from dexter chief to sinister base — from the top left, as you look at it — along the line of the bande.'
  ),
  [DivisionType.bendSinister]: new FrenchWord(
    'taillé',
    'Cut from sinister chief to dexter base — from the top right, as you look at it — along the line of the barre. Sinister means the bearer’s left, never yours.'
  ),
};
