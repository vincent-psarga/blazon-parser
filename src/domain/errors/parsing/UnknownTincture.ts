import { BlazonParseError, TextPosition } from './BlazonParseError';

/** A word standing where a tincture should, naming none the parser holds. */
export class UnknownTincture extends BlazonParseError {
  constructor(
    /** The word as the blazon spelled it, folded to lower case. */
    readonly tincture: string,
    position?: TextPosition
  ) {
    super(`Unknown tincture: ${tincture}`, position);
  }
}
