import { Word } from './Word';

/**
 * How one language spells every term of an enum. A term may have more than one
 * accepted spelling — "mantelé-versé" is also written "mantelé-renversé" — so a
 * translation may give a list, and the first entry is the one used for writing
 * the term back out.
 *
 * Keying on the enum's values rather than its keys makes the record exhaustive:
 * adding a term to the enum breaks every translation that has not caught up.
 *
 * A translation is written in a kind of word, so that a language whose words
 * carry more than their spelling — French, whose articles agree with them —
 * hands its grammar the whole word rather than a string to look up.
 */
export type Translation<T extends string, W extends Word = Word> = Record<T, W | W[]>;

/** A term, together with the word that spelled it. */
export interface TermWord<T extends string, W extends Word = Word> {
  readonly term: T;
  readonly word: W;
}

/** Every word a term accepts, the canonical one first. */
export function wordsOf<T extends string, W extends Word>(
  translation: Translation<T, W>,
  term: T
): readonly W[] {
  const words = translation[term];
  return Array.isArray(words) ? words : [words as W];
}

/** The word a term is written with. */
export function wordOf<T extends string, W extends Word>(
  translation: Translation<T, W>,
  term: T
): W {
  return wordsOf(translation, term)[0];
}

/** Every spelling a term accepts, the canonical one first. */
export function spellingsOf<T extends string, W extends Word>(
  translation: Translation<T, W>,
  term: T
): readonly string[] {
  return wordsOf(translation, term).map((word) => word.value);
}

/** The spelling a term is written with. */
export function nameOf<T extends string, W extends Word>(
  translation: Translation<T, W>,
  term: T
): string {
  return wordOf(translation, term).value;
}

/**
 * Inverts a translation into a lookup from spelling to term, folded to lower
 * case so that a parser can match however the writer capitalised the word.
 *
 * What a spelling leads to is the word as well as the term, because a grammar
 * that reads a word has to agree with the one actually written rather than with
 * the term's canonical spelling.
 */
export function bySpelling<T extends string, W extends Word>(
  translation: Translation<T, W>
): ReadonlyMap<string, TermWord<T, W>> {
  const terms = new Map<string, TermWord<T, W>>();
  for (const term of Object.keys(translation) as T[]) {
    for (const word of wordsOf(translation, term)) {
      terms.set(word.value.toLowerCase(), { term, word });
    }
  }
  return terms;
}
