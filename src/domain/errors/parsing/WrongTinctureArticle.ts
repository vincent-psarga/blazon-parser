import { TextPosition } from './BlazonParseError';
import { UnknownTincture } from './UnknownTincture';

/**
 * A tincture the parser holds, introduced by an article that does not agree with
 * it: "de or" for "d'or".
 *
 * It is a kind of UnknownTincture because the words as written name no tincture,
 * however well the word inside them would on its own.
 */
export class WrongTinctureArticle extends UnknownTincture {
  constructor(
    tincture: string,
    /** How the tincture ought to have been introduced: "d'or". */
    readonly expected: string,
    position?: TextPosition
  ) {
    super(tincture, position);
    this.message = `Wrong elision: expected "${expected}"`;
  }
}
