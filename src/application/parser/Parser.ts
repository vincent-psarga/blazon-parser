import { Parser, expectEOF } from 'typescript-parsec';
import { BlazonParseError } from '../../domain/errors/parsing/BlazonParseError';
import { TokenKind, tokenise } from '../lexer/Lexer';
import { raisedBy } from './Failures';

/**
 * Every entry point runs its rule the same way: tokenise, demand the whole input
 * is consumed, and demand the grammar settled on exactly one reading of it.
 *
 * typescript-parsec's own expectSingleResult would do the last two, but it
 * throws a TokenError built from the message and position alone, dropping the
 * error object and with it the complaint the grammar attached. The output is
 * therefore read here, so that what escapes says which kind of failure it was.
 */
export function parseWith<TResult>(parser: Parser<TokenKind, TResult>, input: string): TResult {
  const output = expectEOF(parser.parse(tokenise(input)));

  if (!output.successful) {
    throw raisedBy(output.error, input);
  }
  if (output.candidates.length === 0) {
    throw new BlazonParseError('No reading of this blazon was returned.');
  }
  if (output.candidates.length !== 1) {
    throw new BlazonParseError('This blazon has more than one reading.');
  }
  return output.candidates[0].result;
}
