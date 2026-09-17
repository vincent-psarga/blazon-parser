import { ChargeType } from '../models/Charge';
import { Tincture } from '../models/Tinctures';
import { Translation } from './Translation';
import { Word } from './Word';

/**
 * What a language calls a field sown with a charge, where it has a word for it
 * at all.
 *
 * Heraldry would rather name a strewing than describe one: Parker gives
 * "billetty" for a field semy of billets and calls the special term preferable,
 * and French says "billeté" where it could say "semé de billettes". The word is
 * the field's rather than the charge's — it is formed as a varied field's name
 * is, out of the figure it repeats — so it is kept apart from the charges
 * themselves, which go on meaning one billet borne once.
 *
 * Not every charge has one, and inventing the missing ones would be inventing
 * heraldry: a charge with no word here is sown in as many words. Being keyed on
 * ChargeType all the same, a charge added to the vocabulary breaks this until it
 * is said whether the language names a strewing of it.
 */
export type Strewings<W extends Word = Word> = Record<ChargeType, W | W[] | undefined>;

/**
 * The charges this language names a strewing of, as a translation of its own.
 *
 * A Translation is exhaustive by design, and this is not: what it holds is the
 * terms the language has a word for, which is exactly what a parser reading
 * those words has to match against. It is built rather than written down, so the
 * incompleteness is the vocabulary's and not a translation somebody forgot to
 * finish.
 */
export function strewnTerms<W extends Word>(strewings: Strewings<W>): Translation<ChargeType, W> {
  return Object.fromEntries(
    Object.entries(strewings).filter(([, words]) => words !== undefined)
  ) as Translation<ChargeType, W>;
}

/**
 * The word a field sown with this charge in this tincture is written with, where
 * the language has one.
 *
 * Chosen as a charge's own name is chosen, and stopping where that one falls
 * back on the canonical word: a strewing no word of this language means is
 * written the long way round rather than by a word that would be wrong about the
 * tincture. A bezanty is gold, and a field sown with silver roundels is not
 * bezanty at all — it is semy of plates.
 */
export function strewnIn<W extends Word>(
  strewings: Strewings<W>,
  type: ChargeType,
  tincture: Tincture
): W | undefined {
  const words = strewnWords(strewings, type);
  return (
    words.find((word) => word.defaultTincture === tincture) ??
    words.find((word) => word.accepts(tincture))
  );
}

/** Every word this language names a strewing of this charge with, the canonical one first. */
function strewnWords<W extends Word>(strewings: Strewings<W>, type: ChargeType): readonly W[] {
  const words = strewings[type];
  if (words === undefined) {
    return [];
  }
  return Array.isArray(words) ? words : [words];
}
