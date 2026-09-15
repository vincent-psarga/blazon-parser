import { Word } from '../Word';

/**
 * A French word, which agrees with what introduces it in two ways a bare
 * spelling does not carry.
 *
 * Gender decides the article the field bears it under — "à la fasce" but "au
 * chevron" — and elision decides whether "de" contracts before it. Elision can
 * usually be read off the first letter, but not always: a French h is either
 * mute, when the word behaves as though it began with the vowel behind it, or
 * aspirated, when it does not — "d'hermine", but "de hérisson". Neither that nor
 * gender can be derived, so both are declared where the default is wrong.
 */
export class FrenchWord extends Word {
  /** Whether the word is feminine: "la fasce" against "le chevron". */
  public readonly isFeminine: boolean;

  /** Whether "de" contracts to "d'" before the word. */
  public readonly needsElision: boolean;

  constructor(
    value: string,
    options?: Partial<{
      plural: string;
      isFeminine: boolean;
      needsElision: boolean;
    }>
  ) {
    super(value, options);
    this.isFeminine = options?.isFeminine ?? false;
    this.needsElision = options?.needsElision ?? /^[aeiouyàâäéèêëîïôöùûü]/.test(value);
  }
}
