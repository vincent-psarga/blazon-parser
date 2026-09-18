import { Modifier } from '../../models/Modifier';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

// A modifier is a participle rather than a noun, so it has no gender of its own
// and takes the one of whatever it is said of: "au tourteau évidé", "à la
// billette évidée", "à trois billettes évidées". All four writings are the one
// word, and which of them a blazon must use is decided by the phrase it stands
// in rather than by anything here.
//
// French says it with two participles and not one. Évider and vider are two
// verbs, so évidé and vidé are two words rather than two spellings of one, and
// each stands on its own in the vocabulary — as vairy and vairé do, and for the
// same reason: telling a reader they were the one word would be telling them
// something false.
//
// Which figure takes which is a distinction the armorials keep and this does not
// keep yet. The dictionaries blazon the croix vidée, and give évidé to the
// triangle and the star and percé to the billette; here either word is read of
// any charge that will take the modifier at all, and évidé is what comes back.
export const FrenchModifiers: Translation<Modifier, FrenchWord> = {
  [Modifier.voided]: [
    new FrenchWord(
      'évidé',
      'The middle taken out, so that the field shows through where the charge was and what is left of it is the outline. What shows through is the field itself and not a tincture of its own, which is what makes a losange évidée a losange still rather than two charges one upon the other. The heraldic dictionaries say it of the triangle and the star.'
    ),
    new FrenchWord(
      'vidé',
      'The middle taken out, so that the field shows through where the charge was: the same thing évidé says, from the other of the two verbs French has for saying it. The heraldic dictionaries say it of the croix and the sautoir — "d’or, à la croix vidée de gueules" — where évidé is said of the triangle and the star.'
    ),
  ],
};
