import { apply, tok } from 'typescript-parsec';
import { DivisionType } from '../../domain/models/Field';
import { TokenKind } from '../lexer/Lexer';
import { guard } from './Combinators';

// The four simple partitions, each named in French after the line that divides
// the field: "parti" cuts per pale, "coupé" per fess, and so on.
const DIVISIONS: ReadonlyMap<string, DivisionType> = new Map([
  ['parti', DivisionType.pale],
  ['coupé', DivisionType.fess],
  ['tranché', DivisionType.bend],
  ['taillé', DivisionType.bendSinister],
]);

export const DIVISION = apply(
  guard(
    tok(TokenKind.Word),
    (token) => DIVISIONS.has(token.text.toLowerCase()),
    (token) => `Unknown division: ${token.text.toLowerCase()}`
  ),
  // The guard above has established the word names a division.
  (token) => DIVISIONS.get(token.text.toLowerCase()) as DivisionType
);
