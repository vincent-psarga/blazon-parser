import { BlazonParseError, TextPosition } from './BlazonParseError';

/**
 * A field called plain and then charged: "D'azur plain au besant".
 *
 * Plain says the field bears nothing at all — it is the whole of what the word
 * is for — so a blazon that goes on to lay something on it has contradicted
 * itself in two words, and neither of them is wrong on its own. Nothing was
 * misnamed, so there is no word to report: what is reported is how much was laid
 * on a field that was promised bare.
 */
export class ChargedPlainField extends BlazonParseError {
  constructor(
    /** How many things the blazon went on to lay on it. */
    readonly borne: number,
    position?: TextPosition
  ) {
    super(
      `A plain field bears nothing: ${borne === 1 ? 'one was' : `${borne} were`} laid on it`,
      position
    );
  }
}
