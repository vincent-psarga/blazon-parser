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
  [VariationType.barry]: new Word(
    'barry',
    'The line of a fess taken over and over: the field cut across into equal bars of two tinctures laid alternately.'
  ),
  [VariationType.paly]: new Word(
    'paly',
    'The line of a pale taken over and over: the field cut down into equal upright pieces of two tinctures laid alternately. The first tincture takes the piece at dexter, the viewer’s left.'
  ),
  [VariationType.bendy]: new Word(
    'bendy',
    'The line of a bend repeated, corner to corner. The first tincture takes the piece against the dexter chief corner, which is how the armorials draw it.'
  ),
  // Parker gives "pily", "paly pily" and "pily counter pily" for the same field;
  // the shortest is written back, and the one naming the piles is read too.
  [VariationType.pily]: [
    new Word(
      'pily',
      'Not a line repeated but a rank of long triangles driven into each other point first: piles from the chief, and piles from the base between them, each driven into the gaps the others leave.'
    ),
    new Word(
      'pily counter pily',
      'A rank of long triangles driven into each other point first: piles from the chief, and piles from the base between them. Parker’s fuller name for the field, counting the piles driven up as well as those driven down, and saying no more than pily.'
    ),
  ],
  [VariationType.chevronny]: new Word(
    'chevronny',
    'The chevron repeated down the field, each piece bent to the same point.'
  ),
};

/** What stands between the name of a varied field and how many pieces it has. */
export const OF = 'of';
