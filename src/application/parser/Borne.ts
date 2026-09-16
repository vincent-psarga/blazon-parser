import { Parser, ParserOutput, Token, apply, seq } from 'typescript-parsec';
import { BlazonParseError, TextPosition } from '../../domain/errors/parsing/BlazonParseError';
import { RepeatedOrdinary } from '../../domain/errors/parsing/RepeatedOrdinary';
import { ChargeType } from '../../domain/models/Charge';
import { OrdinaryType, SEVERAL, bornInNumber, isOrdinaryType } from '../../domain/models/Ordinary';
import { NumberWords } from '../../domain/translations/Numbers';
import { TermWord, Translation, asSeveral } from '../../domain/translations/Translation';
import { Word } from '../../domain/translations/Word';
import { TokenKind } from '../lexer/Lexer';
import { guard, spelledTerm } from './Combinators';
import { Vocabulary } from './Failures';
import { number } from './Numbers';

/**
 * A term as a blazon named it among the things a field bears: which one, and how
 * many of it where the blazon said more than one.
 *
 * The count is what a language reads and the shared rule turns into the model;
 * how a language says it — "à trois chevrons", "three chevrons" — is its own
 * business. A band and a charge are named by the same phrase, so both are read
 * into this.
 */
export interface Borne<T extends string> {
  readonly type: T;
  /** How many are borne, where more than one is. */
  readonly count?: number;
}

/**
 * A count a vocabulary will not take, for the terms it will not take one of.
 *
 * Refusing is a reading's business rather than the model's: the field cannot
 * bear two chiefs, and a blazon that asks for two is told so by name rather than
 * by failing to parse. A vocabulary whose every term may be borne in number —
 * the charges are — supplies none of this.
 */
export interface Refusal<T extends string, W extends Word> {
  readonly accepts: (named: TermWord<T, W>, count: number) => boolean;
  readonly complain: (
    named: TermWord<T, W>,
    count: number,
    position?: TextPosition
  ) => BlazonParseError;
}

/** One of something, which is what a name with no number before it says. */
export function alone<T extends string>(named: Parser<TokenKind, T>): Parser<TokenKind, Borne<T>> {
  return apply(named, (type): Borne<T> => ({ type }));
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
 * Several of one term: how many, and which — the name being read in the plural,
 * because that is how a blazon that bears several writes it.
 */
export function several<T extends string, W extends Word, N extends Word>(
  terms: Translation<T, W>,
  numbers: NumberWords<N>,
  vocabulary: Vocabulary,
  refusal?: Refusal<T, W>
): Parser<TokenKind, Borne<T>> {
  const counting = number(numbers);
  const named = seq(count(counting), spelledTerm(terms, vocabulary, asSeveral));
  return begunByTheCount(
    counting,
    apply(
      refusal === undefined
        ? named
        : guard(
            named,
            ([count, match]) => refusal.accepts(match, count),
            ([count, match], position) => refusal.complain(match, count, position)
          ),
      ([count, { term }]): Borne<T> => ({ type: term, count })
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

/**
 * What a field bears: a band or a charge.
 *
 * Both are named by the same phrase — an article or a count, then the name, then
 * a tincture — so both are read from one vocabulary rather than tried one after
 * the other. Tried separately, every word in neither list would fail both
 * readings at the same place, and the complaint would be settled by whichever
 * was listed first rather than by anything about the blazon.
 */
export type BorneType = OrdinaryType | ChargeType;

export type BorneTerm = Borne<BorneType>;

/** The two vocabularies a field's bearings are named from, as one. */
export function bearings<W extends Word>(
  ordinaries: Translation<OrdinaryType, W>,
  charges: Translation<ChargeType, W>
): Translation<BorneType, W> {
  return { ...ordinaries, ...charges };
}

/**
 * The refusal the bearings need: four of the ordinaries are borne but once, and
 * every charge may be borne in number.
 */
export const NOT_IN_NUMBER: Refusal<BorneType, Word> = {
  accepts: ({ term }) => !isOrdinaryType(term) || bornInNumber(term),
  complain: ({ word }, count, position) =>
    new RepeatedOrdinary(word.plural.toLowerCase(), count, position),
};
