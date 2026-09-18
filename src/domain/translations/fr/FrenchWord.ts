import { Tincture } from '../../models/Tinctures';
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
 *
 * A word may also have no settled gender at all. Heraldic French kept the
 * feminine "la losange" where the language at large went masculine, and
 * armorials are written both ways, so such a word declares the gender it is
 * written back out in and is read under either.
 */
export class FrenchWord extends Word {
  /** Whether the word is feminine: "la fasce" against "le chevron". */
  public readonly isFeminine: boolean;

  /**
   * Whether the other gender is read too. The word is still written back out in
   * the gender it declares; this only widens what is accepted.
   */
  public readonly acceptsBothGender: boolean;

  /** Whether "de" contracts to "d'" before the word. */
  public readonly needsElision: boolean;

  constructor(
    value: string,
    description: string = '',
    options?: Partial<{
      plural: string;
      allowedTinctures: readonly Tincture[];
      defaultTincture: Tincture;
      isFeminine: boolean;
      acceptsBothGender: boolean;
      needsElision: boolean;
    }>
  ) {
    super(value, description, options);
    this.isFeminine = options?.isFeminine ?? false;
    this.acceptsBothGender = options?.acceptsBothGender ?? false;
    this.needsElision = options?.needsElision ?? /^[aeiouyàâäéèêëîïôöùûü]/.test(value);
  }
}
