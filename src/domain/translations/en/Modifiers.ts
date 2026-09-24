import { Modifier } from '../../models/Modifier';
import { parker } from '../Sources';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English says what was done to the charge in one word, standing after it and
// after its tincture, and agreeing with nothing: a lozenge voided and three
// lozenges voided are the same word twice. So the plural is declared to be the
// word itself rather than left to the "-s" a noun would take.
//
// One word apiece, and no word said of some charges and not of others: English
// voids and pierces whatever will take it, where French keeps a second word for
// the star. So no word here claims any charge, and each is written wherever its
// term is.
export const EnglishModifiers: Translation<Modifier> = {
  [Modifier.voided]: new Word(
    'voided',
    {
      value:
        'The middle taken out, so that the field shows through where the charge was and what is left of it is the outline. What shows through is the field itself and not a tincture of its own, which is what makes a lozenge voided a lozenge still rather than two charges one upon the other.',
      sources: [parker('Voided')],
    },
    { plural: 'voided' }
  ),
  [Modifier.pierced]: new Word(
    'pierced',
    {
      value:
        'A round hole punched through the middle, the rest of the charge left as it was — which is what parts it from voided, where nothing is left but the outline. Parker asks the shape of the hole to be named where it is not round, "e.g. square-pierced, lozenge-pierced"; no blazon says so here, and the hole is round.',
      sources: [parker('Pierced')],
    },
    { plural: 'pierced' }
  ),
};
