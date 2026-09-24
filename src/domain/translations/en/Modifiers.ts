import { Modifier } from '../../models/Modifier';
import { parker } from '../Sources';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English says what was done to the charge in one word, standing after it and
// after its tincture, and agreeing with nothing: a lozenge voided and three
// lozenges voided are the same word twice. So the plural is declared to be the
// word itself rather than left to the "-s" a noun would take.
//
// One word apiece, and no word said of some figures and not of others: English
// voids and pierces whatever will take it, where French keeps a second word for
// the star. So no word here claims anything, and each is written wherever its
// term is.
//
// The three do not all qualify the same thing. Voided and pierced are said of a
// charge and indented of a band, because what is done to a charge is done to its
// middle and what is done to a band is done to the line it is named after. Which
// is which is the model's to say, not this list's: every one of them stands after
// what it qualifies, and the words differ in nothing a grammar can see.
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
  [Modifier.indented]: new Word(
    'indented',
    {
      value:
        'The edges of the band cut into teeth instead of run straight — "notched after the manner of dancetty, but with smaller teeth", as Parker has it, who adds that it "is applied most frequently to the fesse, though the bend, the pale, and the chevron are sometimes thus treated". It is not the dancetty, which is the same line drawn with larger teeth and fewer of them, and which this vocabulary does not hold.',
      sources: [parker('Indented')],
    },
    { plural: 'indented' }
  ),
};
