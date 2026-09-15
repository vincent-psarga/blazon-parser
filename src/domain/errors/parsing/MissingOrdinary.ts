import { BlazonParseError, TextPosition } from './BlazonParseError';

/**
 * No ordinary at all where one was owed: the article promised a band and the
 * blazon ended before naming it.
 */
export class MissingOrdinary extends BlazonParseError {
  constructor(
    /** The phrase the ordinary is missing from: "à la". */
    readonly context: string,
    position?: TextPosition
  ) {
    super(`Missing ordinary in: ${context}`, position);
  }
}
