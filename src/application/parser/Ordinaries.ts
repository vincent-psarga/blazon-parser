import { Parser, ParserOutput, Token, alt, apply, seq, tok } from 'typescript-parsec';
import { BlazonParseError } from '../../domain/errors/parsing/BlazonParseError';
import { RepeatedOrdinary } from '../../domain/errors/parsing/RepeatedOrdinary';
import { OrdinaryType, SEVERAL, bornInNumber } from '../../domain/models/Ordinary';
import { NumberWords } from '../../domain/translations/Numbers';
import { Translation, asSeveral } from '../../domain/translations/Translation';
import { Word } from '../../domain/translations/Word';
import { TokenKind } from '../lexer/Lexer';
import { guard, spelledTerm } from './Combinators';
import { asCount, asOrdinary } from './Failures';

/**
 * An ordinary as a blazon named it: which one, and how many of it where the
 * blazon said more than one. The count is what a language reads and the shared
 * rule turns into the model; how a language says it — "à trois chevrons",
 * "three chevrons" — is its own business.
 */
export interface BorneOrdinary {
  readonly type: OrdinaryType;
  /** How many are borne, where more than one is. */
  readonly count?: number;
}

/** One of an ordinary, which is what a name with no number before it says. */
export function alone(named: Parser<TokenKind, OrdinaryType>): Parser<TokenKind, BorneOrdinary> {
  return apply(named, (type): BorneOrdinary => ({ type }));
}

/**
 * A number, as a blazon writes one: in the language's own word for it — "à trois
 * chevrons" is how a blazon reads — or in figures, which is how a note about a
 * blazon reads and which costs nothing to accept.
 */
function number<W extends Word>(numbers: NumberWords<W>): Parser<TokenKind, number> {
  return alt(
    apply(tok(TokenKind.Number), (token) => Number.parseInt(token.text, 10)),
    apply(spelledTerm(numbers, asCount), ({ term }) => Number.parseInt(term, 10))
  );
}

/**
 * How many are borne, which is never one.
 *
 * A single band is named on its own — "au chevron", "a chevron" — so a number
 * standing before a name is there to say that there are several, and "one" says
 * the opposite of what the phrase it opens is for.
 */
function count(number: Parser<TokenKind, number>): Parser<TokenKind, number> {
  return guard(
    number,
    (count) => count >= SEVERAL,
    (count, position) =>
      new BlazonParseError(
        `A count says there are several: ${count} is not more than one`,
        position
      )
  );
}

/**
 * Several of one ordinary: how many, and which — the name being read in the
 * plural, because that is how a blazon that bears several writes it.
 *
 * The count is refused here rather than by the model, because refusing is a
 * reading's business: the field cannot bear two chiefs, and a blazon that asks
 * for two is told so by name rather than by failing to parse.
 */
export function several<W extends Word, N extends Word>(
  ordinaries: Translation<OrdinaryType, W>,
  numbers: NumberWords<N>
): Parser<TokenKind, BorneOrdinary> {
  const counting = number(numbers);
  return begunByTheCount(
    counting,
    apply(
      guard(
        seq(count(counting), spelledTerm(ordinaries, asOrdinary, asSeveral)),
        ([, { term }]) => bornInNumber(term),
        ([count, { word }], position) =>
          new RepeatedOrdinary(word.plural.toLowerCase(), count, position)
      ),
      ([count, { term }]): BorneOrdinary => ({ type: term, count })
    )
  );
}

/**
 * A phrase whose complaint is moved off the number that opened it and onto the
 * word after it.
 *
 * A number standing where a charge is borne is not some other phrase misread:
 * this one has begun, and whatever is wrong with it lies further on. Left on the
 * number, the complaint would make an English blazon — which names the number
 * first, with nothing before it — look like a phrase that never began at all,
 * and a phrase that never began is given up on in silence rather than reported.
 *
 * What says the phrase began is the number alone, counted or not: "one" is a
 * number a blazon may not bear several of, and saying so is the whole point.
 */
function begunByTheCount<T>(
  number: Parser<TokenKind, number>,
  parser: Parser<TokenKind, T>
): Parser<TokenKind, T> {
  return {
    parse(token: Token<TokenKind> | undefined): ParserOutput<TokenKind, T> {
      const output = parser.parse(token);
      if (output.successful) {
        return output;
      }
      const counted = number.parse(token);
      const name = counted.successful ? counted.candidates[0]?.nextToken : undefined;
      return name === undefined
        ? output
        : { successful: false, error: { ...output.error, pos: name.pos } };
    },
  };
}
