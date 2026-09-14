import { ParseError, ParseResult, Parser, ParserOutput, Token, apply, resultOrError, tok } from 'typescript-parsec';
import { Translation, bySpelling } from '../../domain/translations/Translation';
import { TokenKind } from '../lexer/Lexer';

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
  describe: (value: TResult) => string
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
          rejection = {
            kind: 'Error',
            pos: candidate.firstToken?.pos,
            message: describe(candidate.result),
          };
        }
      }

      return rejection === undefined ? output : resultOrError(kept, rejection, kept.length !== 0);
    },
  };
}

/** Matches one keyword whatever its casing: "et", "parti". */
export function keyword(expected: string): Parser<TokenKind, Token<TokenKind>> {
  return guard(
    tok(TokenKind.Word),
    (token) => token.text.toLowerCase() === expected,
    (token) => `Expected "${expected}", found "${token.text}"`
  );
}

/** A term, together with the spelling the writer actually used for it. */
export interface TermMatch<T extends string> {
  readonly term: T;
  readonly spelling: string;
}

/**
 * Matches the words spelling one of a vocabulary's terms, keeping the spelling
 * alongside the term for grammars whose articles must agree with it.
 *
 * A term may run over several words — "per bend sinister" — so every prefix that
 * names a term is offered as a candidate rather than the longest one alone: it
 * is the surrounding grammar, not the vocabulary, that knows which reading fits.
 */
export function spelledTerm<T extends string>(
  translation: Translation<T>,
  describe: (words: string) => string
): Parser<TokenKind, TermMatch<T>> {
  const terms = bySpelling(translation);
  const longest = Math.max(...Array.from(terms.keys(), (spelling) => spelling.split(' ').length));

  return {
    parse(token: Token<TokenKind> | undefined): ParserOutput<TokenKind, TermMatch<T>> {
      const candidates: ParseResult<TokenKind, TermMatch<T>>[] = [];
      let current = token;
      let spelling = '';

      for (let words = 0; words < longest && current?.kind === TokenKind.Word; words += 1) {
        const word = current.text.toLowerCase();
        spelling = words === 0 ? word : `${spelling} ${word}`;
        const next = current.next;
        const term = terms.get(spelling);
        if (term !== undefined) {
          candidates.push({ firstToken: token, nextToken: next, result: { term, spelling } });
        }
        current = next;
      }

      if (candidates.length !== 0) {
        return { successful: true, candidates, error: undefined };
      }
      return {
        successful: false,
        error: {
          kind: 'Error',
          pos: token?.pos,
          message: describe(spelling === '' ? (token?.text ?? '<end of input>') : spelling.split(' ')[0]),
        },
      };
    },
  };
}

/** Matches a term, keeping only which term it is. */
export function term<T extends string>(
  translation: Translation<T>,
  describe: (words: string) => string
): Parser<TokenKind, T> {
  return apply(spelledTerm(translation, describe), (match) => match.term);
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
