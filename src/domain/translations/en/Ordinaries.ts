import { OrdinaryType } from '../../models/Ordinary';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English names the ordinary with the same word it uses for the line, and tells
// the two apart by what precedes it: "per fess" divides, "a fess" is laid on.
export const EnglishOrdinaryType: Translation<OrdinaryType> = {
  [OrdinaryType.chief]: new Word(
    'chief',
    'A band across the top of the shield, taking about a third of it. The chief is also a place on the shield — the upper part — which is why a division puts its first tincture there.'
  ),
  [OrdinaryType.pale]: new Word(
    'pale',
    'A band straight down the middle. Not the same as per pale, which cuts the field in two: here the field keeps its own tincture and the band is laid over it.'
  ),
  [OrdinaryType.fess]: new Word(
    'fess',
    'A band straight across the middle. Not the same as per fess, which cuts the field in two: here the field keeps its own tincture and the band is laid over it.',
    { plural: 'fesses' }
  ),
  // Gemel is the adjective — twinned — so again it is the noun that pluralises.
  [OrdinaryType.barGemel]: new Word(
    'bar gemel',
    'Two narrow bars close together, borne and blazoned as one charge — gemel is twinned. Three bars gemel are three pairs, and so six bars.',
    { plural: 'bars gemel' }
  ),
  [OrdinaryType.bend]: new Word(
    'bend',
    'A band from dexter chief to sinister base — from the top left, as you look at it. It follows the line per bend divides along.'
  ),
  // The adjective follows the noun, so it is the noun that takes the plural.
  [OrdinaryType.bendSinister]: new Word(
    'bend sinister',
    'A band from sinister chief to dexter base — from the top right, as you look at it. Sinister means the bearer’s left, never yours. It follows the line per bend sinister divides along.',
    { plural: 'bends sinister' }
  ),
  [OrdinaryType.chevron]: new Word(
    'chevron',
    'An inverted V, its point towards the chief and its limbs running down to the base.'
  ),
  [OrdinaryType.cross]: new Word(
    'cross',
    'The pale and the fess crossing — the cross of Saint George. Its four arms are one charge, not two bands. Made small enough to be borne as a charge it is the same word again, and the blazon says which by saying the small one is couped.',
    { plural: 'crosses' }
  ),
  [OrdinaryType.saltire]: new Word(
    'saltire',
    'A diagonal cross, corner to corner — the saltire of Saint Andrew. Its two limbs are one charge, not two.'
  ),
  // English blazon keeps the French spelling for this one, though the plain
  // border is the same word and is read too — and written back as the bordure.
  [OrdinaryType.bordure]: [
    new Word(
      'bordure',
      'A band following the whole edge of the shield, inside it. The bordure crosses the field nowhere, which is why it is so often borne beside another band: blazoned last, it is drawn over whatever it meets.'
    ),
    new Word(
      'border',
      'A band following the whole edge of the shield, inside it, crossing the field nowhere. This is the plain spelling of the word blazon writes as the bordure.'
    ),
  ],
};
