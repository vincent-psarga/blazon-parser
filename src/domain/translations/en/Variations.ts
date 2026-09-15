import { VariationType } from '../../models/Field';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English names a varied field by turning the band it repeats into an adjective
// — barry from the bar, paly from the pale, bendy from the bend — which is the
// same move French makes with its participles, arrived at from the other end.
//
// None of them is ever written in the plural: the word describes the field, not
// the pieces, so the plural a Word carries is never asked for here.
export const EnglishVariationType: Translation<VariationType> = {
  [VariationType.barry]: new Word('barry'),
  [VariationType.paly]: new Word('paly'),
  [VariationType.bendy]: new Word('bendy'),
  // Parker gives "pily", "paly pily" and "pily counter pily" for the same field;
  // the shortest is written back, and the one naming the piles is read too.
  [VariationType.pily]: [new Word('pily'), new Word('pily counter pily')],
  [VariationType.chevronny]: new Word('chevronny'),
};

/** What stands between the name of a varied field and how many pieces it has. */
export const OF = 'of';
