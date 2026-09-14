/**
 * How one language spells every term of an enum. A term may have more than one
 * accepted spelling — "mantelé-versé" is also written "mantelé-renversé" — so a
 * translation may give a list, and the first entry is the one used for writing
 * the term back out.
 *
 * Keying on the enum's values rather than its keys makes the record exhaustive:
 * adding a term to the enum breaks every translation that has not caught up.
 */
export type Translation<T extends string> = Record<T, string | string[]>;

/** Every spelling a term accepts, the canonical one first. */
export function spellingsOf<T extends string>(translation: Translation<T>, term: T): readonly string[] {
  const spellings = translation[term];
  return typeof spellings === 'string' ? [spellings] : spellings;
}

/** The spelling a term is written with. */
export function nameOf<T extends string>(translation: Translation<T>, term: T): string {
  return spellingsOf(translation, term)[0];
}

/**
 * Inverts a translation into a lookup from spelling to term, folded to lower
 * case so that a parser can match however the writer capitalised the word.
 */
export function bySpelling<T extends string>(translation: Translation<T>): ReadonlyMap<string, T> {
  const terms = new Map<string, T>();
  for (const term of Object.keys(translation) as T[]) {
    for (const spelling of spellingsOf(translation, term)) {
      terms.set(spelling.toLowerCase(), term);
    }
  }
  return terms;
}
