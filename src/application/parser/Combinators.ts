import {
  ParseError,
  ParseResult,
  Parser,
  ParserOutput,
  Token,
  apply,
  resultOrError,
  tok,
} from 'typescript-parsec';
import { BlazonParseError, TextPosition } from '../../domain/errors/parsing/BlazonParseError';
import {
  Spelled,
  TermWord,
  Translation,
  asOne,
  bySpelling,
} from '../../domain/translations/Translation';
import { Word } from '../../domain/translations/Word';
import { TokenKind } from '../lexer/Lexer';
import { Vocabulary, complaining, owed, positionOf } from './Failures';

/**
 * Keeps only the candidates a predicate accepts, reporting a rejection as a
 * parse error rather than throwing.
 *
 * Validating inside `apply` would be simpler, but an exception escapes the whole
 * parse: once the grammar offers alternatives, one rejected branch would take
 * its viable siblings down with it. A parse error only fails the branch.
 */
export function guard<TKind, TResult>(
  parser: Parser<TKind, TResult>,
  accepts: (value: TResult) => boolean,
  complain: (value: TResult, position?: TextPosition) => BlazonParseError
): Parser<TKind, TResult> {
  return {
    parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult> {
      const output = parser.parse(token);
      if (!output.successful) {
        return output;
      }

      const kept: ParseResult<TKind, TResult>[] = [];
      let rejection: ParseError | undefined;
      for (const candidate of output.candidates) {
        if (accepts(candidate.result)) {
          kept.push(candidate);
        } else if (rejection === undefined) {
          const pos = candidate.firstToken?.pos;
          rejection = complaining(pos, complain(candidate.result, positionOf(pos)));
        }
      }

      return rejection === undefined ? output : resultOrError(kept, rejection, kept.length !== 0);
    },
  };
}

/**
 * Keeps only the candidates a predicate accepts, and complains about none of
 * them.
 *
 * The other half of `guard`, for a rule that is choosing between readings rather
 * than judging one. Where a word names two terms — the cross that is a band and
 * the cross that is a charge made small out of it — the reading the blazon did
 * not describe is nobody's mistake: it was never meant, and a complaint about it
 * would stand in front of whatever the blazon really got wrong. So it is dropped
 * in silence, and what the phrase had to say for itself is left as it was.
 */
export function keeping<TKind, TResult>(
  parser: Parser<TKind, TResult>,
  accepts: (value: TResult) => boolean
): Parser<TKind, TResult> {
  return {
    parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult> {
      const output = parser.parse(token);
      if (!output.successful) {
        return output;
      }
      const kept = output.candidates.filter((candidate) => accepts(candidate.result));
      return kept.length === output.candidates.length
        ? output
        : resultOrError(kept, output.error, kept.length !== 0);
    },
  };
}

/**
 * Settles between the readings of one phrase, where a word named more than one
 * term and the blazon has now said everything it is going to say about it.
 *
 * `keeping` asks of each reading whether it stands; this asks of the readings
 * that stand which one was meant, which is a question no reading can answer
 * about itself — that a cross is the band rather than the little cross is
 * settled by the other reading being there at all.
 *
 * Only readings that got equally far are settled between. A word may also be the
 * first word of a longer name, and a short reading beside a long one is two
 * different phrases rather than two readings of one: they are left to the
 * grammar that asked for them, which is the only thing that knows how much of
 * the blazon it wanted.
 */
export function settling<TKind, TResult>(
  parser: Parser<TKind, TResult>,
  named: (among: readonly TResult[]) => readonly TResult[]
): Parser<TKind, TResult> {
  return {
    parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult> {
      const output = parser.parse(token);
      if (!output.successful || output.candidates.length < 2) {
        return output;
      }

      const ends = new Map<Token<TKind> | undefined, ParseResult<TKind, TResult>[]>();
      for (const candidate of output.candidates) {
        const alongside = ends.get(candidate.nextToken);
        if (alongside === undefined) {
          ends.set(candidate.nextToken, [candidate]);
        } else {
          alongside.push(candidate);
        }
      }

      const kept = Array.from(ends.values()).flatMap((readings) => {
        if (readings.length < 2) {
          return readings;
        }
        const meant = named(readings.map(({ result }) => result));
        return readings.filter(({ result }) => meant.includes(result));
      });

      return kept.length === output.candidates.length
        ? output
        : resultOrError(kept, output.error, kept.length !== 0);
    },
  };
}

/**
 * Matches one keyword whatever its casing: "et", "parti".
 *
 * A keyword names no term of the vocabulary — it is the grammar's own plumbing —
 * so a missing one is a plain refusal rather than one of the named kinds.
 */
export function keyword(expected: string): Parser<TokenKind, Token<TokenKind>> {
  return guard(
    tok(TokenKind.Word),
    (token) => token.text.toLowerCase() === expected,
    (token, position) =>
      new BlazonParseError(`Expected "${expected}", found "${token.text}"`, position)
  );
}

/**
 * Matches any one of several spellings of the same keyword: "semy" and the
 * French "semé" it was taken from say the one thing, and a blazon may write
 * either.
 *
 * Which of them was written is not kept, there being nothing to keep: a keyword
 * names no term, so all it can say is that it was there.
 */
export function anyKeyword(expected: readonly string[]): Parser<TokenKind, Token<TokenKind>> {
  const spellings = new Set(expected);
  return guard(
    tok(TokenKind.Word),
    (token) => spellings.has(token.text.toLowerCase()),
    (token, position) =>
      new BlazonParseError(`Expected "${expected[0]}", found "${token.text}"`, position)
  );
}

/**
 * Matches the words spelling one of a vocabulary's terms, keeping the word
 * alongside the term for grammars whose articles must agree with it.
 *
 * A term may run over several words — "per bend sinister" — so every prefix that
 * names a term is offered as a candidate rather than the longest one alone: it
 * is the surrounding grammar, not the vocabulary, that knows which reading fits.
 *
 * One of those words may be "de", which the lexer reads as the article it
 * usually is: "fleur de lys" is three tokens and one name. So the article is
 * stepped through where a name is already under way, and never at the start of
 * one — no term of either vocabulary begins with it, and a blazon that opens on
 * an article is naming a tincture rather than a charge.
 *
 * Which form is matched is the caller's to say: a blazon bearing several of an
 * ordinary names them in the plural, and only the rule reading the number knows
 * that it does. Every spelling a word answers to is offered under both, so an
 * alternate wording is read exactly as the spelling it will be written back in.
 *
 * One spelling may name more than one term, and then every term it names is
 * offered: a cross is a band and a charge, and what the blazon says of it settles
 * which. The vocabulary cannot settle that and does not try to — it answers with
 * everything the word could be, exactly as it answers with every prefix that
 * names something.
 */
export function spelledTerm<T extends string, W extends Word>(
  translation: Translation<T, W>,
  vocabulary: Vocabulary,
  spelled: Spelled = asOne
): Parser<TokenKind, TermWord<T, W>> {
  const terms = bySpelling(translation, spelled);
  const longest = Math.max(...Array.from(terms.keys(), (spelling) => spelling.split(' ').length));

  return {
    parse(token: Token<TokenKind> | undefined): ParserOutput<TokenKind, TermWord<T, W>> {
      const candidates: ParseResult<TokenKind, TermWord<T, W>>[] = [];
      let current = token;
      let spelling = '';

      for (let words = 0; words < longest && spells(current, words); words += 1) {
        const word = current.text.toLowerCase();
        spelling = words === 0 ? word : `${spelling} ${word}`;
        const next = current.next;
        for (const match of terms.get(spelling) ?? []) {
          candidates.push({ firstToken: token, nextToken: next, result: match });
        }
        current = next;
      }

      if (candidates.length !== 0) {
        return { successful: true, candidates, error: undefined };
      }

      // A word was read and named nothing, or there was no word at all: the
      // second is not a misspelling and cannot be reported as one.
      const found = spelling === '' ? token?.text : spelling.split(' ')[0];
      return {
        successful: false,
        error:
          found === undefined
            ? owed(vocabulary)
            : complaining(token?.pos, vocabulary.unknown(found, positionOf(token?.pos))),
      };
    },
  };
}

/** Whether this token can be the next word of a name already this many words long. */
function spells(token: Token<TokenKind> | undefined, words: number): token is Token<TokenKind> {
  return token?.kind === TokenKind.Word || (words > 0 && token?.kind === TokenKind.Article);
}

/** Matches a term, keeping only which term it is. */
export function term<T extends string, W extends Word>(
  translation: Translation<T, W>,
  vocabulary: Vocabulary
): Parser<TokenKind, T> {
  return apply(spelledTerm(translation, vocabulary), (match) => match.term);
}

/**
 * Matches something optional that still explains itself once it has begun.
 *
 * `optional` is silent by design, which is right for a phrase that is simply not
 * there. A phrase whose opening words were read and which then went wrong is a
 * different thing: those words committed the reading, so the complaint belongs to
 * the blazon rather than to the grammar's own backtracking. Failing further along
 * than the token it would have started at is what tells the two apart.
 *
 * A phrase may be introduced by something that promises nothing — the mark a
 * blazon sets between the charges it lays on the field. That is stepped over
 * before the phrase is read, and it is the phrase that decides whether anything
 * began: a mark with a phrase after it joins the two, and the same mark with
 * nothing after it is the blazon's own punctuation and is left where it stands.
 */
export function optionalUnlessBegun<TKind, TResult>(
  parser: Parser<TKind, TResult>,
  introduction?: Parser<TKind, unknown>
): Parser<TKind, TResult | undefined> {
  return {
    parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult | undefined> {
      const from = introduction === undefined ? token : stepOver(introduction, token);
      const output = parser.parse(from);
      if (output.successful || began(from, output.error)) {
        return output;
      }
      return {
        successful: true,
        candidates: [{ firstToken: token, nextToken: token, result: undefined }],
        error: undefined,
      };
    },
  };
}

/** Where a phrase begins, once whatever introduces it has been read past. */
function stepOver<TKind>(
  introduction: Parser<TKind, unknown>,
  token: Token<TKind> | undefined
): Token<TKind> | undefined {
  const output = introduction.parse(token);
  return output.successful ? output.candidates[0].nextToken : token;
}

/**
 * Whether a reading had got under way before it failed.
 *
 * Failing at the very token it would have started on means nothing here
 * introduces such a phrase at all. Failing later — or running out of input,
 * which is later than any token — means the opening words were read and what
 * they promised is still owed.
 */
function began<TKind>(token: Token<TKind> | undefined, error: ParseError): boolean {
  return token !== undefined && (error.pos === undefined || error.pos.index > token.pos.index);
}

/**
 * Matches something optional, without reporting why it was absent.
 *
 * typescript-parsec's own opt_sc carries the failed branch's error forward, and
 * errors at the same token are settled in favour of the first — so an absent
 * article ends up shadowing the complaint that actually explains the failure.
 */
export function optional<TKind, TResult>(
  parser: Parser<TKind, TResult>
): Parser<TKind, TResult | undefined> {
  return {
    parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult | undefined> {
      const output = parser.parse(token);
      if (output.successful) {
        return output;
      }
      return {
        successful: true,
        candidates: [{ firstToken: token, nextToken: token, result: undefined }],
        error: undefined,
      };
    },
  };
}
