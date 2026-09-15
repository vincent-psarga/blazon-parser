import { Field } from './Field';
import { Ordinary } from './Ordinary';

/**
 * A field, and whatever is laid on it. The ordinaries are optional because most
 * of the blazons the vocabulary can read carry nothing at all.
 *
 * They are kept in the order the blazon named them, because that order says
 * which covers which: a bordure blazoned after three bends is drawn over them,
 * and the same bordure blazoned before them is drawn under. Heraldry writes what
 * is laid on the field in the order it is laid, and the drawing obeys.
 */
export type Blazon = {
  field: Field;
  ordinaries?: readonly Ordinary[];
};
