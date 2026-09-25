import { ChargeType } from '../../models/Charge';
import { Modifier } from '../../models/Modifier';
import { blasonArmoiries } from '../Sources';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

// A modifier is a participle rather than a noun, so it has no gender of its own
// and takes the one of whatever it is said of: "au tourteau vidé", "à la
// billette vidée", "à trois billettes vidées". All four writings are the one
// word, and which of them a blazon must use is decided by the phrase it stands
// in rather than by anything here.
//
// French says the voiding with two participles and not one. Évider and vider are
// two verbs, so évidé and vidé are two words rather than two spellings of one,
// and each stands on its own in the vocabulary — as vairy and vairé do, and for
// the same reason: telling a reader they were the one word would be telling them
// something false.
//
// Which figure takes which is a distinction the armorials keep, and it is kept
// here: évidé claims the star, which is what the dictionaries say it of, and
// vidé claims nothing and is therefore what every other charge is written with.
// Either word is still read of any charge that will take the modifier at all — a
// blazon that voids a losange with évidé is understood, and answered with vidée.
//
// Percé is not a third word for the same thing, whatever the dictionaries'
// filing suggests. It is the word for the other modifier, and the other drawing:
// see Modifier.pierced.
//
// Denché is not the word for the indenting, though Parker glosses indented "(fr.
// denché)" and glosses the dancetty with it too. French tells the two apart by
// the size of the teeth where English tells them apart by the word: denché is
// said of lines "en forme de dents de scie de grandes dimensions", and "dentelé
// est le denché dont les angles sont plus petits et plus nombreux". The line this
// draws is the small-toothed one, so dentelé is what it is written with and read
// under; denché belongs to the dancetty, and arrives with it. Reading it here
// would answer a blazon that asked for great teeth with a band of small ones,
// which is the one thing a vocabulary must not do.
export const FrenchModifiers: Translation<Modifier, FrenchWord> = {
  [Modifier.voided]: [
    new FrenchWord('vidé', {
      value:
        'The middle taken out, so that the field shows through where the charge was and what is left of it is the outline. What shows through is the field itself and not a tincture of its own, which is what makes a losange vidée a losange still rather than two charges one upon the other. The heraldic dictionaries say it of the croix and the sautoir — "d’or, à la croix vidée de gueules" — and it is the word this vocabulary writes of every charge the star has not taken.',
      sources: [blasonArmoiries('Vidé')],
    }),
    new FrenchWord(
      'évidé',
      {
        value:
          'The middle taken out: the same thing vidé says, from the other of the two verbs French has for saying it. The dictionaries keep it for the star and the triangle — "évidés, pour les triangles et étoiles", and "d’azur, à l’étoile évidée d’argent" — so it is the word written of the étoile, and vidé is written of the rest.',
        sources: [blasonArmoiries('Évidé')],
      },
      { saidOf: [ChargeType.mullet] }
    ),
  ],
  [Modifier.pierced]: [
    new FrenchWord('percé', {
      value:
        'A round hole punched through the middle, the rest of the charge left as it was. The dictionaries file it under Vidé — "on se sert du terme percées, pour les billettes" — but a billette percée is not a billette vidée: voiding leaves the outline of the charge and nothing else, and piercing leaves the charge with a hole in it. Two figures, so two words, and this one is not a way of writing the other.',
      sources: [blasonArmoiries('Percé')],
    }),
  ],
  [Modifier.indented]: [
    new FrenchWord('dentelé', {
      value:
        'The edges of the band cut into small teeth instead of run straight: "dentelé est le denché dont les angles sont plus petits et plus nombreux". It is not denché, which is the same line cut "en forme de dents de scie de grandes dimensions" and is what English calls dancetty — a second drawing, and one this vocabulary does not hold. A fasce dentelée is the band English blazons a fess indented.',
      // Under Denché, which is where the dictionary's Dentelé sends a reader and
      // where the two are told apart.
      sources: [blasonArmoiries('Denché', 'denche')],
    }),
  ],
};
