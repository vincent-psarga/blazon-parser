import { apply, tok } from 'typescript-parsec';
import { DivisionType } from '../../domain/models/Field';
import { bySpelling } from '../../domain/translations/Translation';
import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { TokenKind } from '../lexer/Lexer';
import { guard } from './Combinators';

const DIVISIONS = bySpelling(FrenchDivisionType);

export const DIVISION = apply(
  guard(
    tok(TokenKind.Word),
    (token) => DIVISIONS.has(token.text.toLowerCase()),
    (token) => `Unknown division: ${token.text.toLowerCase()}`
  ),
  // The guard above has established the word names a division.
  (token) => DIVISIONS.get(token.text.toLowerCase()) as DivisionType
);
