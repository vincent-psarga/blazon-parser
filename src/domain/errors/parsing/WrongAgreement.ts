import { BlazonParseError, TextPosition } from './BlazonParseError';

/**
 * A word that qualifies another and does not agree with it: "au losange
 * évidée", where the blazon made the charge masculine and then said the
 * feminine of it.
 *
 * It belongs to the languages that ask for agreement and to no others: English
 * writes "voided" after anything and has nothing to get wrong here. What the
 * word must agree with is what the blazon itself said — the article is the
 * blazon's own word for the gender, and a blazon that has chosen one is held to
 * it.
 */
export class WrongAgreement extends BlazonParseError {
  constructor(
    /** The word as the blazon spelled it, folded to lower case: "évidée". */
    readonly written: string,
    /** How it ought to have been written to agree: "évidé". */
    readonly expected: string,
    position?: TextPosition
  ) {
    super(`Wrong agreement: expected "${expected}"`, position);
  }
}
