import { TextPosition } from './BlazonParseError';
import { UnknownOrdinary } from './UnknownOrdinary';

/**
 * An ordinary the parser holds, under an article that does not agree with it in
 * gender: "au fasce" for "à la fasce".
 *
 * It is a kind of UnknownOrdinary because the words as written name no ordinary,
 * however well the word inside them would on its own.
 */
export class WrongOrdinaryArticle extends UnknownOrdinary {
  constructor(
    ordinary: string,
    /** How the ordinary ought to have been introduced: "à la fasce". */
    readonly expected: string,
    position?: TextPosition
  ) {
    super(ordinary, position);
    this.message = `Wrong article: expected "${expected}"`;
  }
}
