import { laLangueDuBlason } from '../Sources';
import { FrenchWord } from './FrenchWord';

/**
 * The word French calls a bare field by: "de gueules plain", which says the
 * shield carries its tincture and nothing whatever besides.
 *
 * It names no term and adds nothing to what the field is, so there is nothing in
 * the model to hold it and nothing to write back. It is vocabulary all the same
 * — a reader meets it in the armorials and has to be told what it promises — so
 * it is kept here with the rest of the words, and the grammar reads it off this.
 *
 * "Plein" is not read for it: that is the undifferenced arms of the head of a
 * family, which is another word entirely and says nothing about the field.
 */
export const FrenchPlain = new FrenchWord('plain', {
  value:
    'Said of a field that carries nothing whatever: de gueules plain. It states a fact the blazon has already stated by stopping, so nothing in the model holds it and nothing writes it back. It is read all the same, and held to: a field called plain and then charged is refused rather than quietly drawn, the two words contradicting each other.',
  sources: [
    laLangueDuBlason('« plain » et « plein »', '2012/08/plain-et-plein-en-langue-du-blason.html'),
  ],
});
