import { RankWords } from '../Ranks';
import { blasonArmoiries } from '../Sources';
import { FrenchWord } from './FrenchWord';

// French names the rank of a part with an ordinal, and the armorials write it in
// words — "au premier", "au second" — or in figures, "au 1". Only the words are
// named here: a rank in figures is read by the rule that reads any number in
// figures, and a Roman numeral is a word like any other and is spelled out as
// one.
//
// Which part is which is Au blason des armoiries' to say, under Écartelé: "Le
// premier quartier de l'Écartelé est en chef, à dextre ; le second est à
// senestre". It is said there of four parts rather than two, that being where a
// dictionary has occasion to say it at all, and the order is the order.
//
// "Second" and "deuxième" say the one thing and both are read; the shorter is
// written back. Nothing here agrees with anything: the ordinal stands before a
// whole coat rather than before a noun, and the armorials write it masculine.
//
// The Roman numerals are read and are attested nowhere this vocabulary cites:
// neither Écartelé nor Parti writes one, and no armorial here does either. What
// they are glossed by is what the rank means, which is the same rank however it
// is spelled.
export const FrenchRanks: RankWords<FrenchWord> = {
  1: [
    new FrenchWord('premier', {
      value:
        'The first part of a divided field: the one in chief, or at dexter. Whatever is blazoned after it is laid in that part. Written "au premier", and in figures: "au 1".',
      sources: [blasonArmoiries('Écartelé'), blasonArmoiries('Parti')],
    }),
    new FrenchWord('I', {
      value:
        'The first part of a divided field, its rank written as a Roman numeral. It says what "au premier" says.',
      sources: [blasonArmoiries('Écartelé')],
    }),
  ],
  2: [
    new FrenchWord('second', {
      value:
        'The other part of a divided field, the one the first is not. Whatever is blazoned after it is laid there. Written "au second", and in figures: "au 2".',
      sources: [blasonArmoiries('Écartelé'), blasonArmoiries('Parti')],
    }),
    new FrenchWord('deuxième', {
      value:
        'The other part of a divided field, said the longer way. It says what "au second" says.',
      sources: [blasonArmoiries('Écartelé')],
    }),
    new FrenchWord('II', {
      value:
        'The other part of a divided field, its rank written as a Roman numeral. It says what "au second" says.',
      sources: [blasonArmoiries('Écartelé')],
    }),
  ],
};
