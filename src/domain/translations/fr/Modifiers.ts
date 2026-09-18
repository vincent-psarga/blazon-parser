import { ChargeType } from '../../models/Charge';
import { Modifier } from '../../models/Modifier';
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
export const FrenchModifiers: Translation<Modifier, FrenchWord> = {
  [Modifier.voided]: [
    new FrenchWord(
      'vidé',
      'The middle taken out, so that the field shows through where the charge was and what is left of it is the outline. What shows through is the field itself and not a tincture of its own, which is what makes a losange vidée a losange still rather than two charges one upon the other. The heraldic dictionaries say it of the croix and the sautoir — "d’or, à la croix vidée de gueules" — and a croix a blazon voids is read here as the meuble rather than the band, a band taking no modifier at all. It is the word written of every charge the star has not taken.'
    ),
    new FrenchWord(
      'évidé',
      'The middle taken out: the same thing vidé says, from the other of the two verbs French has for saying it. The dictionaries keep it for the star and the triangle — "évidés, pour les triangles et étoiles", and "d’azur, à l’étoile évidée d’argent" — so it is the word written of the étoile, and vidé is written of the rest.',
      { saidOf: [ChargeType.mullet] }
    ),
  ],
  [Modifier.pierced]: [
    new FrenchWord(
      'percé',
      'A round hole punched through the middle, the rest of the charge left as it was. The dictionaries file it under Vidé — "on se sert du terme percées, pour les billettes" — but a billette percée is not a billette vidée: voiding leaves the outline of the charge and nothing else, and piercing leaves the charge with a hole in it. Two figures, so two words, and this one is not a way of writing the other.'
    ),
  ],
  // Alésé says of a figure that it stops short of the edges of the shield. Said
  // of the croix it says which cross was meant — the band reaches the edges and
  // the meuble does not — so it is the word a blazon writes when it names the
  // small one by the big one's word. Written back, the croisette says it in a
  // noun and this word is never needed.
  [Modifier.couped]: [
    new FrenchWord(
      'alésé',
      'Cut short of the edges of the shield: "se dit d’un chef, d’une croix, d’un pal, d’un sautoir, en un mot de toutes les pièces honorables dont les extrémités ne touchent pas les bords de l’écu". Said of the croix it tells the meuble from the band both are named by, and the dictionaries say the croisette "est toujours alésée". Read of a croix and answered with the croisette, which says the same thing in one word.'
    ),
  ],
};
