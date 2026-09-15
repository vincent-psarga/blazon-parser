import { BlazonParseError, TextPosition } from './BlazonParseError';

/**
 * No tincture at all where one was owed: the blazon ended first.
 *
 * Nothing was misnamed, so there is no word to report — only the phrase that was
 * left owing one.
 */
export class MissingTincture extends BlazonParseError {
  constructor(
    /** The phrase the tincture is missing from: "à la fasce". */
    readonly context: string,
    position?: TextPosition
  ) {
    super(`Missing tincture in: ${context}`, position);
  }
}
