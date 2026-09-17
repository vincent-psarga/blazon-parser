import { TINCTURES, Tincture } from '../models/Tinctures';

/**
 * One word of a language's heraldic vocabulary, with what the grammar needs to
 * put it in a sentence.
 *
 * A term is spelled by a word rather than by a bare string because agreement is
 * a property of the word itself: whether it pluralises regularly, and, in the
 * languages that ask, its gender and its elision. Naming those on the word keeps
 * the grammar from holding lists of exceptions it would have to be told about
 * every time the vocabulary grows.
 *
 * A word may also carry the tincture, which is the roundel's doing. Heraldry
 * names that charge after the coin, the disc or the cake it is the picture of,
 * and each of those names is a tincture as well as a shape: a bezant is gold
 * because a bezant is a gold coin, and calling one azure says nothing. So the
 * word declares which tinctures it will take and which one it means when the
 * blazon names none — both being properties of the word rather than of the term
 * behind it, since "besant" and "tourteau" are one charge and disagree about
 * exactly this.
 */
export class Word {
  /** The word as more than one: "fasces" for "fasce". */
  public readonly plural: string;

  /**
   * The tinctures the word may be borne in. Every one of them, for the words
   * that are a shape and nothing more; a word that names a tincture of its own
   * takes that one alone unless it says otherwise.
   */
  public readonly allowedTinctures: readonly Tincture[];

  /** The tincture the word is understood to be when the blazon names none. */
  public readonly defaultTincture?: Tincture;

  constructor(
    public readonly value: string,
    options?: Partial<{
      plural: string;
      allowedTinctures: readonly Tincture[];
      defaultTincture: Tincture;
    }>
  ) {
    this.plural = options?.plural ?? `${value}s`;
    this.defaultTincture = options?.defaultTincture;
    this.allowedTinctures =
      options?.allowedTinctures ??
      (this.defaultTincture === undefined ? TINCTURES : [this.defaultTincture]);
  }

  /** Whether the word may be borne in a tincture. */
  accepts(tincture: Tincture): boolean {
    return this.allowedTinctures.includes(tincture);
  }
}
