import {
  ParseResult,
  Parser,
  Token,
  alt,
  apply,
  betterError,
  combine,
  kleft,
  nil,
  resultOrError,
  rule,
  seq,
  tok,
} from 'typescript-parsec';
import { BlazonParseError } from '../../domain/errors/parsing/BlazonParseError';
import { MissingPieces } from '../../domain/errors/parsing/MissingPieces';
import { Blazon, ChargeOrOrdinary } from '../../domain/models/Blazon';
import {
  Division,
  DivisionType,
  Field,
  FurType,
  Furred,
  PIECES,
  Variation,
  cutInPieces,
  usualPieces,
} from '../../domain/models/Field';
import { Tincture } from '../../domain/models/Tinctures';
import { TokenKind } from '../lexer/Lexer';
import { BorneTerm, carried } from './Borne';
import { guard, optional, optionalUnlessBegun } from './Combinators';
import { within } from './Failures';
import { VariedField } from './Variations';

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
  /**
   * The name of a furred field. Nothing follows it but the two tinctures its
   * pelt is cut from: a fur is cut to no number of pieces, so neither tongue
   * counts anything here.
   */
  readonly fur: Parser<TokenKind, FurType>;
  /**
   * The name of a varied field, with however many pieces the language counts
   * before naming the tinctures: "barry of six", where French says only "fascé".
   */
  readonly variation: Parser<TokenKind, VariedField>;
  /**
   * However many pieces the language counts after the tinctures — "de six
   * pièces" — where it counts them there at all. English does not, and leaves
   * this off.
   */
  readonly pieces?: Parser<TokenKind, number>;
  /**
   * The name of a band or a charge, with whatever says the field bears it, and
   * how many. Both are named by the same phrase, so both are read by one rule.
   */
  readonly borne: Parser<TokenKind, BorneTerm>;
  /** The conjunction joining the halves of a divided field. */
  readonly and: Parser<TokenKind, unknown>;
}

/** The mark a blazon may set between the charges it lays on the field. */
const SEPARATOR = tok(TokenKind.Separator);

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

  // A varied field is the same two tinctures cut along the same lines, over and
  // over — so it is read as a division is, with a number of pieces around it.
  //
  // Where that number stands is the language's business: English counts before
  // the tinctures, French after them, and either may leave it unsaid. What
  // arrives is taken wherever it came from, and what never arrives is the number
  // the term is understood to have — save for the pily, which is understood to
  // have none and must therefore be counted.
  const trailingPieces: Parser<TokenKind, number | undefined> =
    grammar.pieces === undefined ? nil() : optional(grammar.pieces);

  const variedField = within(
    apply(
      guard(
        apply(
          seq(grammar.variation, grammar.tincture, grammar.and, grammar.tincture, trailingPieces),
          ([named, firstTincture, , secondTincture, counted]) => ({
            named,
            firstTincture,
            secondTincture,
            pieces: counted ?? named.pieces ?? usualPieces(named.type),
          })
        ),
        ({ named, pieces }) => pieces !== undefined && cutInPieces(named.type, pieces),
        ({ named, pieces }, position) =>
          pieces === undefined
            ? new MissingPieces(named.named, position)
            : new BlazonParseError(
                pieces < PIECES
                  ? `A field is cut into pieces: ${pieces} is not more than one`
                  : `A ${named.named} alternates its tinctures, so its pieces are even: ${pieces} is odd`,
                position
              )
      ),
      // Whatever reaches here was counted: the guard has refused every field
      // whose pieces neither the blazon nor the term itself could say.
      ({ named, firstTincture, secondTincture, pieces }): Variation => ({
        type: named.type,
        firstTincture,
        secondTincture,
        pieces: pieces as number,
      })
    )
  );

  // A furred field names the fur and the two tinctures it is cut from, and is
  // read exactly as a division is: what differs is the vocabulary the first word
  // belongs to, and that the pelt takes the whole field rather than half of it.
  const furredField = within(
    apply(
      seq(grammar.fur, grammar.tincture, grammar.and, grammar.tincture),
      ([type, firstTincture, , secondTincture]): Furred => ({
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

  // The varied reading is tried first of the three, because all three open on a
  // word of their own vocabulary and all three complain about the same word when
  // they fail: a tie between them is settled in favour of whichever was listed
  // first, and only the varied one has anything to say beyond the name — that the
  // pieces were never counted, or counted in a number no such field is cut into.
  const field = eitherReading(
    plainField,
    alt(variedField, furredField, dividedField),
    restOfDivision
  );

  // What the field bears is laid on it and carries a tincture of its own, however
  // many of it are borne: two chevrons are two bands of one tincture, not two
  // charges each with its own, and three billets are three of one tincture too.
  // A plain thing, at that: a charge upon a charge, a band drawn with a modified
  // line, and where on the field a charge stands are all still outside the
  // vocabulary.
  //
  // Which tinctures may follow is the name's own affair — a besant is a gold
  // coin and there is no blue one — so the tincture is read after the name has
  // been read rather than beside it, and the word that was written decides what
  // it will take and what it means when nothing follows at all.
  //
  // The count is left off rather than set to one when a single one is borne, so
  // that a fess reads back as the fess it was before a field could bear two.
  const bearing = within(
    combine(grammar.borne, (borne) =>
      apply(carried(grammar.tincture, borne.word), (tincture): ChargeOrOrdinary =>
        borne.count === undefined
          ? { type: borne.type, tincture }
          : { type: borne.type, tincture, count: borne.count }
      )
    )
  );

  // Everything the field bears, read in the order it was written, because that
  // order is what says which covers which: "D'or à trois bandes de sable ; à la
  // bordure de gueules" puts the bordure over the bends.
  //
  // A blazon may set a mark between the phrases — French writes the semicolon as
  // readily as the comma — or set none at all and let the article do the work,
  // so the mark is read and discarded rather than required.
  const borne = rule<TokenKind, readonly ChargeOrOrdinary[]>();
  borne.setPattern(
    apply(
      optionalUnlessBegun(seq(bearing, borne), SEPARATOR),
      (laid): readonly ChargeOrOrdinary[] => (laid === undefined ? [] : [laid[0], ...laid[1]])
    )
  );

  // The key is left off rather than set to an empty list when nothing is borne,
  // so a plain field reads back as the blazon it was before anything could be
  // laid on one.
  const arms = apply(seq(field, borne), ([field, laid]): Blazon =>
    laid.length === 0 ? { field } : { field, chargesOrOrdinaries: laid }
  );

  // A blazon is written as a sentence and closed with a full stop, but the stop
  // carries no meaning, so it is accepted and discarded rather than required. A
  // blazon copied out of an armorial can end on the mark that set it apart from
  // the next one, which means no more than the stop does.
  return kleft(arms, optional(alt(tok(TokenKind.Period), SEPARATOR)));
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
