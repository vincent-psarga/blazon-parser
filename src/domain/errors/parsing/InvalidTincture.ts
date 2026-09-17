import { BlazonParseError, TextPosition } from './BlazonParseError';

/**
 * A tincture the parser holds, on a name that will not be borne in it: "au
 * besant d'azur", where a besant is a gold coin and an azure one is nothing.
 *
 * Both words are known and both are spelled rightly, so this is neither an
 * unknown tincture nor an unknown charge: it is the blazon contradicting itself,
 * the name having already said what tincture the charge is. The blazon that
 * meant it says "au tourteau d'azur", which is the same disc under the name its
 * colour answers to.
 */
export class InvalidTincture extends BlazonParseError {
  constructor(
    /** The name as the blazon spelled it, folded to lower case: "besant". */
    readonly borne: string,
    /** The tincture as the blazon wrote it, article and all: "d'azur". */
    readonly tincture: string,
    position?: TextPosition
  ) {
    super(`Wrong tincture: ${borne} is never ${tincture}`, position);
  }
}
