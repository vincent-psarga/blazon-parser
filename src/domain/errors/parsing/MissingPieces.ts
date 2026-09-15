import { BlazonParseError, TextPosition } from './BlazonParseError';

/**
 * A varied field whose pieces were never counted, and for which heraldry settles
 * no number to fall back on: "Pily argent and gules", which says everything but
 * how many piles.
 *
 * Nothing was misnamed, so there is no word to report — only the field that was
 * left owing a number.
 */
export class MissingPieces extends BlazonParseError {
  constructor(
    /** The field the number is missing from: "pily". */
    readonly variation: string,
    position?: TextPosition
  ) {
    super(`Missing pieces: ${variation} must say how many`, position);
  }
}
