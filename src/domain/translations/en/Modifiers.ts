import { Modifier } from '../../models/Modifier';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English says what was done to the charge in one word, standing after it and
// after its tincture, and agreeing with nothing: a lozenge voided and three
// lozenges voided are the same word twice. So the plural is declared to be the
// word itself rather than left to the "-s" a noun would take.
//
// No word here is said of some charges and not of others: English voids and
// pierces whatever will take it, where French keeps a second word for the star.
// So no word claims any charge, and each is written wherever its term is —
// including where a term has two words, one of them the older.
export const EnglishModifiers: Translation<Modifier> = {
  [Modifier.voided]: new Word(
    'voided',
    'The middle taken out, so that the field shows through where the charge was and what is left of it is the outline. What shows through is the field itself and not a tincture of its own, which is what makes a lozenge voided a lozenge still rather than two charges one upon the other.',
    { plural: 'voided' }
  ),
  [Modifier.pierced]: new Word(
    'pierced',
    'A round hole punched through the middle, the rest of the charge left as it was — which is what parts it from voided, where nothing is left but the outline. Parker asks the shape of the hole to be named where it is not round, "e.g. square-pierced, lozenge-pierced"; no blazon says so here, and the hole is round.',
    { plural: 'pierced' }
  ),
  // Couped and humetty are two words and not two spellings of one, and Parker
  // divides them by what they are said of: humetty "is a term applied to certain
  // ordinaries instead of couped, which is applied to charges". What is borne
  // here is the charge — the cross made small enough to be borne in number — so
  // couped is written and humetty is read.
  [Modifier.couped]: [
    new Word(
      'couped',
      'Cut short of the edges of the shield, so that what is left stands free on the field. Parker keeps it for the charges, where humetty is his word for an ordinary cut the same way — and a cross small enough to be borne as a charge is a charge, so this is the word written of it. Said of a cross it says which cross was meant: the band reaches the edges and this one does not, and one noun names them both.',
      { plural: 'couped' }
    ),
    new Word(
      'humetty',
      'Cut short of every edge, the figure touching nothing. Parker’s word for an ordinary so treated — "a term applied to certain ordinaries instead of couped, which is applied to charges" — and the word the armorials write of a cross that stops short of the shield. It says what couped says and comes back written as couped, what is borne being the charge.',
      { plural: 'humetty' }
    ),
  ],
};
