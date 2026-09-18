import { Modifier } from '../../models/Modifier';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English says what was done to the charge in one word, standing after it and
// after its tincture, and agreeing with nothing: a lozenge voided and three
// lozenges voided are the same word twice. So the plural is declared to be the
// word itself rather than left to the "-s" a noun would take.
export const EnglishModifiers: Translation<Modifier> = {
  [Modifier.voided]: new Word(
    'voided',
    'The middle taken out, so that the field shows through where the charge was and what is left of it is the outline. What shows through is the field itself and not a tincture of its own, which is what makes a lozenge voided a lozenge still rather than two charges one upon the other.',
    { plural: 'voided' }
  ),
};
