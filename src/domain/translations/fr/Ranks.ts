import { RankWords } from '../Ranks';
import { FrenchWord } from './FrenchWord';

// French names the rank of a part with an ordinal, and the armorials write it
// three ways: in words — "au premier", "au second" — in figures, "au 1", and in
// Roman numerals, "au I", which is how the armorial of the Plantagenets writes
// it. Only words are named here: a rank in figures is read by the rule that
// reads any number in figures, and a Roman numeral is a word like any other and
// is spelled out as one.
//
// "Second" and "deuxième" say the one thing and both are written; the shorter
// is written back. Nothing here agrees with anything: the ordinal stands before
// a whole coat rather than before a noun, and the armorials write it masculine.
export const FrenchRanks: RankWords<FrenchWord> = {
  1: [
    new FrenchWord(
      'premier',
      'Names the first part of a divided field — the half in chief, or the one at dexter — so that the arms after it are laid in that part and not the other. Written "au premier", and in figures or Roman numerals as readily: "au 1", "au I".'
    ),
    new FrenchWord(
      'I',
      'The first part of a divided field, its rank written as a Roman numeral. It says what "au premier" says.'
    ),
  ],
  2: [
    new FrenchWord(
      'second',
      'Names the other part of a divided field, so that the arms after it are laid in that part. Written "au second", and in figures or Roman numerals as readily: "au 2", "au II".'
    ),
    new FrenchWord(
      'deuxième',
      'The other part of a divided field, said the longer way. It says what "au second" says, and the armorials write both.'
    ),
    new FrenchWord(
      'II',
      'The other part of a divided field, its rank written as a Roman numeral. It says what "au second" says.'
    ),
  ],
};
