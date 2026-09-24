import { OrdinaryType } from '../../models/Ordinary';
import { parker } from '../Sources';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English names the ordinary with the same word it uses for the line, and tells
// the two apart by what precedes it: "per fess" divides, "a fess" is laid on.
export const EnglishOrdinaryType: Translation<OrdinaryType> = {
  [OrdinaryType.chief]: new Word('chief', {
    value:
      'A band across the top of the shield, taking about a third of it. The chief is also a place on the shield — the upper part — which is why a division puts its first tincture there.',
    sources: [parker('Chief')],
  }),
  [OrdinaryType.pale]: new Word('pale', {
    value:
      'A band straight down the middle. Not the same as per pale, which cuts the field in two: here the field keeps its own tincture and the band is laid over it.',
    sources: [parker('Pale')],
  }),
  [OrdinaryType.fess]: new Word(
    'fess',
    {
      value:
        'A band straight across the middle. Not the same as per fess, which cuts the field in two: here the field keeps its own tincture and the band is laid over it.',
      sources: [parker('Fesse')],
    },
    { plural: 'fesses' }
  ),
  // Gemel is the adjective — twinned — so again it is the noun that pluralises.
  [OrdinaryType.barGemel]: new Word(
    'bar gemel',
    {
      value:
        'Two narrow bars close together, borne and blazoned as one charge — gemel is twinned. Three bars gemel are three pairs, and so six bars.',
      sources: [parker('Gemel')],
    },
    { plural: 'bars gemel' }
  ),
  [OrdinaryType.bend]: new Word('bend', {
    value:
      'A band from dexter chief to sinister base — from the top left, as you look at it. It follows the line per bend divides along.',
    sources: [parker('Bend')],
  }),
  // The adjective follows the noun, so it is the noun that takes the plural.
  [OrdinaryType.bendSinister]: new Word(
    'bend sinister',
    {
      value:
        'A band from sinister chief to dexter base — from the top right, as you look at it. Sinister means the bearer’s left, never yours. It follows the line per bend sinister divides along.',
      sources: [parker('Bend sinister')],
    },
    { plural: 'bends sinister' }
  ),
  [OrdinaryType.chevron]: new Word('chevron', {
    value: 'An inverted V, its point towards the chief and its limbs running down to the base.',
    sources: [parker('Chevron')],
  }),
  [OrdinaryType.cross]: new Word(
    'cross',
    {
      value:
        'The pale and the fess crossing — the cross of Saint George. Its four arms are one charge, not two bands. Made small enough to be borne as a charge it is a cross couped instead.',
      sources: [parker('Cross')],
    },
    { plural: 'crosses' }
  ),
  [OrdinaryType.saltire]: new Word('saltire', {
    value:
      'A diagonal cross, corner to corner — the saltire of Saint Andrew. Its two limbs are one charge, not two.',
    sources: [parker('Saltire')],
  }),
  // English blazon keeps the French spelling for this one, though the plain
  // border is the same word and is read too — and written back as the bordure.
  [OrdinaryType.bordure]: [
    new Word('bordure', {
      value:
        'A band following the whole edge of the shield, inside it. The bordure crosses the field nowhere, which is why it is so often borne beside another band: blazoned last, it is drawn over whatever it meets.',
      sources: [parker('Bordure')],
    }),
    new Word('border', {
      value:
        'A band following the whole edge of the shield, inside it, crossing the field nowhere. This is the plain spelling of the word blazon writes as the bordure.',
      sources: [parker('Bordure')],
    }),
  ],
};
