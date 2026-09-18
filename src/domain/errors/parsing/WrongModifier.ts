import { BlazonParseError, TextPosition } from './BlazonParseError';

/**
 * A modifier the parser holds, laid on something that will not take it: "an
 * annulet voided", where an annulet is a roundel voided already.
 *
 * Both words are known and both are spelled rightly, so this is neither an
 * unknown charge nor an unknown word: it is the blazon asking for a figure
 * heraldry has no second name for, or asking twice for one it has already got.
 */
export class WrongModifier extends BlazonParseError {
  constructor(
    /** The name of what was borne, as its vocabulary spells it: "annulet". */
    readonly borne: string,
    /** The modifier as its vocabulary spells it: "voided". */
    readonly modifier: string,
    position?: TextPosition
  ) {
    super(`Wrong modifier: ${borne} is never ${modifier}`, position);
  }
}
