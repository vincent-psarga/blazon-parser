import { alt, apply, rule, seq } from 'typescript-parsec';
import { Division, Field } from '../../domain/models/Field';
import { TokenKind } from '../lexer/Lexer';
import { keyword } from './Combinators';
import { DIVISION } from './Division';
import { TINCTURE } from './Tincture';

const PLAIN_FIELD = apply(TINCTURE, (tincture): Field => ({ tincture }));

const DIVIDED_FIELD = apply(
  seq(DIVISION, TINCTURE, keyword('et'), TINCTURE),
  ([type, firstTincture, , secondTincture]): Division => ({ type, firstTincture, secondTincture })
);

export const FIELD = rule<TokenKind, Field>();

// The two shapes are disjoint, so the order does not change what parses. It does
// decide which complaint survives when both fail at the same token, and reporting
// an unknown tincture beats reporting an unknown division for a one-word blazon.
FIELD.setPattern(alt(PLAIN_FIELD, DIVIDED_FIELD));
