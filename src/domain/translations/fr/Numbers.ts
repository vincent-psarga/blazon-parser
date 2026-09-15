import { NumberWords } from '../Numbers';
import { FrenchWord } from './FrenchWord';

// French counts a blazon's charges in words — "à trois chevrons d'or" — and
// stops here, at sixteen, because the next number is written with a hyphen and
// the lexer reads words rather than punctuation. One is missing on purpose: a
// single band is named on its own, without a number in front of it.
export const FrenchNumbers: NumberWords<FrenchWord> = {
  2: new FrenchWord('deux'),
  3: new FrenchWord('trois'),
  4: new FrenchWord('quatre'),
  5: new FrenchWord('cinq'),
  6: new FrenchWord('six'),
  7: new FrenchWord('sept'),
  8: new FrenchWord('huit'),
  9: new FrenchWord('neuf'),
  10: new FrenchWord('dix'),
  11: new FrenchWord('onze'),
  12: new FrenchWord('douze'),
  13: new FrenchWord('treize'),
  14: new FrenchWord('quatorze'),
  15: new FrenchWord('quinze'),
  16: new FrenchWord('seize'),
};
