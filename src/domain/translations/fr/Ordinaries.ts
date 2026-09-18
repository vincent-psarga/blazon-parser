import { OrdinaryType } from '../../models/Ordinary';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

// French names the band itself, where it names a partition after the line that
// cuts the field: "coupé" divides, "fasce" is laid on. The two diagonals are the
// bande and the barre, which is the pair "tranché" and "taillé" divide along.
//
// Gender is what the article agrees with — "à la fasce", "au chevron" — so each
// name carries it.
export const FrenchOrdinaryType: Translation<OrdinaryType, FrenchWord> = {
  [OrdinaryType.chief]: new FrenchWord(
    'chef',
    'A band across the top of the shield, taking about a third of it. The chef is also a place on the shield — the upper part — which is why a partition puts its first tincture there.'
  ),
  [OrdinaryType.pale]: new FrenchWord(
    'pal',
    'A band straight down the middle. Not the same as parti, which cuts the field in two: here the field keeps its own tincture and the band is laid over it.'
  ),
  [OrdinaryType.fess]: new FrenchWord(
    'fasce',
    'A band straight across the middle. Not the same as coupé, which cuts the field in two: here the field keeps its own tincture and the band is laid over it.',
    { isFeminine: true }
  ),
  [OrdinaryType.barGemel]: new FrenchWord(
    'jumelle',
    'Two narrow bars close together, borne and blazoned as one charge: the word is the pair rather than either bar. Three jumelles are three pairs, and so six bars.',
    { isFeminine: true }
  ),
  [OrdinaryType.bend]: new FrenchWord(
    'bande',
    'A band from dexter chief to sinister base — from the top left, as you look at it. It follows the line tranché divides along.',
    { isFeminine: true }
  ),
  [OrdinaryType.bendSinister]: new FrenchWord(
    'barre',
    'A band from sinister chief to dexter base — from the top right, as you look at it. Sinister means the bearer’s left, never yours. It follows the line taillé divides along.',
    { isFeminine: true }
  ),
  [OrdinaryType.chevron]: new FrenchWord(
    'chevron',
    'An inverted V, its point towards the chief and its limbs running down to the base.'
  ),
  [OrdinaryType.cross]: new FrenchWord(
    'croix',
    'The pal and the fasce crossing — the cross of Saint George. Its four arms are one charge, not two bands. Made small enough to be borne as a meuble it is the croisette, and the croix alésée says the same thing in the band’s own word.',
    { isFeminine: true, plural: 'croix' }
  ),
  [OrdinaryType.saltire]: new FrenchWord(
    'sautoir',
    'A diagonal cross, corner to corner — the saltire of Saint Andrew. Its two limbs are one charge, not two.'
  ),
  [OrdinaryType.bordure]: new FrenchWord(
    'bordure',
    'A band following the whole edge of the shield, inside it. The bordure crosses the field nowhere, which is why it is so often borne beside another band: blazoned last, it is drawn over whatever it meets.',
    { isFeminine: true }
  ),
};
