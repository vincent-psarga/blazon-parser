import { Field } from './Field';
import { Ordinary } from './Ordinary';

/**
 * A field, and whatever is laid on it. The ordinary is optional because most of
 * the blazons the vocabulary can read carry nothing at all.
 */
export type Blazon = {
  field: Field;
  ordinary?: Ordinary;
};
