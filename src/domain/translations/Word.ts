/**
 * One word of a language's heraldic vocabulary, with what the grammar needs to
 * put it in a sentence.
 *
 * A term is spelled by a word rather than by a bare string because agreement is
 * a property of the word itself: whether it pluralises regularly, and, in the
 * languages that ask, its gender and its elision. Naming those on the word keeps
 * the grammar from holding lists of exceptions it would have to be told about
 * every time the vocabulary grows.
 */
export class Word {
  /** The word as more than one: "fasces" for "fasce". */
  public readonly plural: string;

  constructor(
    public readonly value: string,
    options?: Partial<{
      plural: string;
    }>
  ) {
    this.plural = options?.plural ?? `${value}s`;
  }
}
