import { Parser, expectEOF, expectSingleResult } from 'typescript-parsec';
import { TokenKind, tokenise } from '../lexer/Lexer';

// Every entry point runs its rule the same way: tokenise, demand the whole input
// is consumed, and demand the grammar settled on exactly one reading of it.
export function parseWith<TResult>(parser: Parser<TokenKind, TResult>, input: string): TResult {
  return expectSingleResult(expectEOF(parser.parse(tokenise(input))));
}
