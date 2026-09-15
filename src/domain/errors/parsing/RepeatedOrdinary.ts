import { BlazonParseError, TextPosition } from './BlazonParseError';

/**
 * More than one of an ordinary a field bears but once: "aux 2 chefs".
 *
 * The word names an ordinary the parser holds and the number is plainly read, so
 * this is neither an unknown ordinary nor a miscount: it is the blazon asking
 * for something heraldry does not have.
 */
export class RepeatedOrdinary extends BlazonParseError {
  constructor(
    /** The word as the blazon spelled it, folded to lower case. */
    readonly ordinary: string,
    /** How many the blazon asked for. */
    readonly count: number,
    position?: TextPosition
  ) {
    super(`Borne but once: ${ordinary}, not ${count} of them`, position);
  }
}
