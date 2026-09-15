import { NumberWords } from '../Numbers';
import { Word } from '../Word';

// English counts as French does — "Gules three chevrons or" — and stops at the
// same place, the next number being hyphenated in both languages.
export const EnglishNumbers: NumberWords = {
  2: new Word('two'),
  3: new Word('three'),
  4: new Word('four'),
  5: new Word('five'),
  6: new Word('six'),
  7: new Word('seven'),
  8: new Word('eight'),
  9: new Word('nine'),
  10: new Word('ten'),
  11: new Word('eleven'),
  12: new Word('twelve'),
  13: new Word('thirteen'),
  14: new Word('fourteen'),
  15: new Word('fifteen'),
  16: new Word('sixteen'),
};
