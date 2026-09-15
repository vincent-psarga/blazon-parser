import {
  ParseResult,
  Parser,
  Token,
  apply,
  betterError,
  kleft,
  resultOrError,
  seq,
  tok,
} from 'typescript-parsec';
import { Blazon } from '../../domain/models/Blazon';
import { Division, DivisionType, Field } from '../../domain/models/Field';
import { Ordinary, OrdinaryType } from '../../domain/models/Ordinary';
import { Tincture } from '../../domain/models/Tinctures';
import { TokenKind } from '../lexer/Lexer';
import { optional, optionalUnlessBegun } from './Combinators';
import { within } from './Failures';

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
  /** The name of an ordinary, with whatever says the field bears it. */
  readonly ordinary: Parser<TokenKind, OrdinaryType>;
  /** The conjunction joining the halves of a divided field. */
  readonly and: Parser<TokenKind, unknown>;
}

export function blazonRule(grammar: BlazonGrammar): Parser<TokenKind, Blazon> {
  const plainField = apply(grammar.tincture, (tincture): Field => ({ tincture }));

  // Wrapped as a phrase so that a tincture which never arrives is reported as
  // missing from the division that owed it, rather than from the blazon at large.
  const dividedField = within(
    apply(
      seq(grammar.division, grammar.tincture, grammar.and, grammar.tincture),
      ([type, firstTincture, , secondTincture]): Division => ({
        type,
        firstTincture,
        secondTincture,
      })
    )
  );

  // What follows a partition's name: the two tinctures it divides the field
  // between. Reading it alone is how an unknown first word is told apart from a
  // word that was never meant to be a partition at all.
  const restOfDivision = seq(grammar.tincture, grammar.and, grammar.tincture);

  const field = eitherReading(plainField, dividedField, restOfDivision);

  // An ordinary is laid on the field and carries a tincture of its own. One at
  // most, and a plain one: a charge upon a charge, and a band drawn with a
  // modified line, are both still outside the vocabulary.
  const ordinary = within(
    apply(seq(grammar.ordinary, grammar.tincture), ([type, tincture]): Ordinary => ({
      type,
      tincture,
    }))
  );

  // The key is left off rather than set to undefined when nothing is borne, so a
  // plain field reads back as the blazon it was before ordinaries existed.
  const arms = apply(seq(field, optionalUnlessBegun(ordinary)), ([field, ordinary]): Blazon =>
    ordinary === undefined ? { field } : { field, ordinary }
  );

  // A blazon is written as a sentence and closed with a full stop, but the stop
  // carries no meaning, so it is accepted and discarded rather than required.
  return kleft(arms, optional(tok(TokenKind.Period)));
}

/**
 * A field read both ways at once, and the complaint that survives when neither
 * reading works.
 *
 * The two shapes are disjoint, so this changes nothing about what parses. What
 * it settles is which complaint is reported. A plain field and a divided one
 * begin at the same word, so a word in neither vocabulary fails both readings at
 * the same place, and typescript-parsec breaks that tie in favour of whichever
 * rule was listed first. Listing either first is wrong for the other: every
 * unknown word would be an unknown tincture — "Écartelé d'azur et d'or"
 * included, though it plainly names a partition the vocabulary does not hold —
 * or else "de or" would be an unknown partition rather than a bad elision.
 *
 * What follows decides it. If the rest of the blazon reads as the rest of a
 * division — two tinctures and the conjunction between them — then what came
 * before was meant to name the line, and the complaint is that the line is
 * unknown. Otherwise nothing was divided and the complaint belongs to the plain
 * reading.
 */
function eitherReading(
  plain: Parser<TokenKind, Field>,
  divided: Parser<TokenKind, Field>,
  restOfDivision: Parser<TokenKind, unknown>
): Parser<TokenKind, Field> {
  return {
    parse(token) {
      const asPlain = plain.parse(token);
      const asDivided = divided.parse(token);

      const candidates: ParseResult<TokenKind, Field>[] = [
        ...(asPlain.successful ? asPlain.candidates : []),
        ...(asDivided.successful ? asDivided.candidates : []),
      ];
      if (candidates.length !== 0) {
        return resultOrError(candidates, betterError(asPlain.error, asDivided.error), true);
      }

      // betterError keeps the complaint from the furthest token, and its first
      // argument when the two are level — which is the tie this decides.
      return resultOrError(
        [],
        opensDivision(token, restOfDivision)
          ? betterError(asDivided.error, asPlain.error)
          : betterError(asPlain.error, asDivided.error),
        false
      );
    },
  };
}

/**
 * Whether what stands here opens a division: whether the rest of one follows.
 *
 * A partition may be named in several words — "per bend sinister" — and one the
 * vocabulary does not hold may run to as many, so the whole run of words is
 * tried rather than the first alone. Nothing but words is stepped over: an
 * article opens the field itself, and leaves no partition left to be naming.
 */
function opensDivision(
  token: Token<TokenKind> | undefined,
  restOfDivision: Parser<TokenKind, unknown>
): boolean {
  let after = token?.next;
  while (after !== undefined) {
    if (restOfDivision.parse(after).successful) {
      return true;
    }
    if (after.kind !== TokenKind.Word) {
      return false;
    }
    after = after.next;
  }
  return false;
}
