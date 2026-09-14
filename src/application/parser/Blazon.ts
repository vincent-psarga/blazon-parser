import { apply, kleft, opt_sc, rule, tok } from 'typescript-parsec';
import { Blazon } from '../../domain/models/Blazon';
import { TokenKind } from '../lexer/Lexer';
import { FIELD } from './Field';

export const BLAZON = rule<TokenKind, Blazon>();

// A blazon is written as a sentence and closed with a full stop, but the stop
// carries no meaning, so it is accepted and discarded rather than required.
BLAZON.setPattern(apply(kleft(FIELD, opt_sc(tok(TokenKind.Period))), (field) => ({ field })));
