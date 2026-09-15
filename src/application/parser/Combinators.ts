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
import { TermWord, Translation, bySpelling } from '../../domain/translations/Translation';
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
 * Matches the words spelling one of a vocabulary's terms, keeping the word
 * alongside the term for grammars whose articles must agree with it.
 *
 * A term may run over several words — "per bend sinister" — so every prefix that
 * names a term is offered as a candidate rather than the longest one alone: it
 * is the surrounding grammar, not the vocabulary, that knows which reading fits.
 */
export function spelledTerm<T extends string, W extends Word>(
  translation: Translation<T, W>,
  vocabulary: Vocabulary
): Parser<TokenKind, TermWord<T, W>> {
  const terms = bySpelling(translation);
  const longest = Math.max(...Array.from(terms.keys(), (spelling) => spelling.split(' ').length));

  return {
    parse(token: Token<TokenKind> | undefined): ParserOutput<TokenKind, TermWord<T, W>> {
      const candidates: ParseResult<TokenKind, TermWord<T, W>>[] = [];
      let current = token;
      let spelling = '';

      for (let words = 0; words < longest && current?.kind === TokenKind.Word; words += 1) {
        const word = current.text.toLowerCase();
        spelling = words === 0 ? word : `${spelling} ${word}`;
        const next = current.next;
        const match = terms.get(spelling);
        if (match !== undefined) {
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
 */
export function optionalUnlessBegun<TKind, TResult>(
  parser: Parser<TKind, TResult>
): Parser<TKind, TResult | undefined> {
  return {
    parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult | undefined> {
      const output = parser.parse(token);
      if (output.successful || began(token, output.error)) {
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
