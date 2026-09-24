import { OrdinaryType } from '../../models/Ordinary';
import { blasonArmoiries } from '../Sources';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

// French names the band itself, where it names a partition after the line that
// cuts the field: "coupé" divides, "fasce" is laid on. The two diagonals are the
// bande and the barre, which is the pair "tranché" and "taillé" divide along.
//
// Gender is what the article agrees with — "à la fasce", "au chevron" — so each
// name carries it.
export const FrenchOrdinaryType: Translation<OrdinaryType, FrenchWord> = {
  [OrdinaryType.chief]: new FrenchWord('chef', {
    value:
      'A band across the top of the shield, taking about a third of it. The chef is also a place on the shield — the upper part — which is why a partition puts its first tincture there.',
    sources: [blasonArmoiries('Chef')],
  }),
  [OrdinaryType.pale]: new FrenchWord('pal', {
    value:
      'A band straight down the middle. Not the same as parti, which cuts the field in two: here the field keeps its own tincture and the band is laid over it.',
    sources: [blasonArmoiries('Pal')],
  }),
  [OrdinaryType.fess]: new FrenchWord(
    'fasce',
    {
      value:
        'A band straight across the middle. Not the same as coupé, which cuts the field in two: here the field keeps its own tincture and the band is laid over it.',
      sources: [blasonArmoiries('Fasce')],
    },
    { isFeminine: true }
  ),
  [OrdinaryType.barGemel]: new FrenchWord(
    'jumelle',
    {
      value:
        'Two narrow bars close together, borne and blazoned as one charge: the word is the pair rather than either bar. Three jumelles are three pairs, and so six bars.',
      sources: [blasonArmoiries('Jumelle')],
    },
    { isFeminine: true }
  ),
  [OrdinaryType.bend]: new FrenchWord(
    'bande',
    {
      value:
        'A band from dexter chief to sinister base — from the top left, as you look at it. It follows the line tranché divides along.',
      sources: [blasonArmoiries('Bande')],
    },
    { isFeminine: true }
  ),
  [OrdinaryType.bendSinister]: new FrenchWord(
    'barre',
    {
      value:
        'A band from sinister chief to dexter base — from the top right, as you look at it. Sinister means the bearer’s left, never yours. It follows the line taillé divides along.',
      sources: [blasonArmoiries('Barre')],
    },
    { isFeminine: true }
  ),
  [OrdinaryType.chevron]: new FrenchWord('chevron', {
    value: 'An inverted V, its point towards the chief and its limbs running down to the base.',
    sources: [blasonArmoiries('Chevron')],
  }),
  [OrdinaryType.cross]: new FrenchWord(
    'croix',
    {
      value:
        'The pal and the fasce crossing — the cross of Saint George. Its four arms are one charge, not two bands. Made small enough to be borne as a meuble it is no longer the croix but the croisette.',
      sources: [blasonArmoiries('Croix')],
    },
    { isFeminine: true, plural: 'croix' }
  ),
  [OrdinaryType.saltire]: new FrenchWord('sautoir', {
    value:
      'A diagonal cross, corner to corner — the saltire of Saint Andrew. Its two limbs are one charge, not two.',
    sources: [blasonArmoiries('Sautoir')],
  }),
  [OrdinaryType.bordure]: new FrenchWord(
    'bordure',
    {
      value:
        'A band following the whole edge of the shield, inside it. The bordure crosses the field nowhere, which is why it is so often borne beside another band: blazoned last, it is drawn over whatever it meets.',
      sources: [blasonArmoiries('Bordure')],
    },
    { isFeminine: true }
  ),
};
