import { Parser, alt, apply, kleft, seq, tok } from 'typescript-parsec';
import { Blazon } from '../../domain/models/Blazon';
import { Division, DivisionType, Field } from '../../domain/models/Field';
import { Tincture } from '../../domain/models/Tinctures';
import { TokenKind } from '../lexer/Lexer';
import { optional } from './Combinators';

/**
 * What one language contributes to reading a blazon. The shape of a blazon is
 * the same in every language — a field, plain or divided between two tinctures —
 * so only the words and whatever introduces them differ.
 */
export interface BlazonGrammar {
  /** A tincture, with whatever article the language puts in front of it. */
  readonly tincture: Parser<TokenKind, Tincture>;
  /** The name of a partition. */
  readonly division: Parser<TokenKind, DivisionType>;
  /** The conjunction joining the halves of a divided field. */
  readonly and: Parser<TokenKind, unknown>;
}

export function blazonRule(grammar: BlazonGrammar): Parser<TokenKind, Blazon> {
  const plainField = apply(grammar.tincture, (tincture): Field => ({ tincture }));

  const dividedField = apply(
    seq(grammar.division, grammar.tincture, grammar.and, grammar.tincture),
    ([type, firstTincture, , secondTincture]): Division => ({ type, firstTincture, secondTincture })
  );

  // The two shapes are disjoint, so the order does not change what parses. It does
  // decide which complaint survives when both fail at the same token, and reporting
  // an unknown tincture beats reporting an unknown division for a one-word blazon.
  const field = alt(plainField, dividedField);

  // A blazon is written as a sentence and closed with a full stop, but the stop
  // carries no meaning, so it is accepted and discarded rather than required.
  return apply(kleft(field, optional(tok(TokenKind.Period))), (field) => ({ field }));
}
