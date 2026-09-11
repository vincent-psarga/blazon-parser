import { ParseError, ParseResult, Parser, ParserOutput, Token, resultOrError } from 'typescript-parsec';

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
