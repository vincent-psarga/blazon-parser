import { Parser, expectEOF, expectSingleResult } from 'typescript-parsec';
import { Blazon } from '../../domain/models/Blazon';
import { Tincture } from '../../domain/models/Tinctures';
import { TokenKind, tokenise } from '../lexer/Lexer';
import { BLAZON } from './Blazon';
import { TINCTURE } from './Tincture';

// Every entry point runs its rule the same way: tokenise, demand the whole input
// is consumed, and demand the grammar settled on exactly one reading of it.
function parseWith<TResult>(parser: Parser<TokenKind, TResult>, input: string): TResult {
  return expectSingleResult(expectEOF(parser.parse(tokenise(input))));
}

export function parseTincture(input: string): Tincture {
  return parseWith(TINCTURE, input);
}

export function parseBlazon(input: string): Blazon {
  return parseWith(BLAZON, input);
}
