import { BlazonParseError, TextPosition } from './BlazonParseError';

/** A field charged with a band the parser does not hold: "champagne". */
export class UnknownOrdinary extends BlazonParseError {
  constructor(
    /** The word as the blazon spelled it, folded to lower case. */
    readonly ordinary: string,
    position?: TextPosition
  ) {
    super(`Unknown ordinary: ${ordinary}`, position);
  }
}
