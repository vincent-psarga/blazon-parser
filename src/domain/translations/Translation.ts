import { Tincture } from '../models/Tinctures';
import { Spelling, Word } from './Word';

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

/**
 * The word a term is written with when it is borne in a given tincture.
 *
 * A term whose words carry no tincture has but one answer, and this is the
 * canonical word again. The roundel is why there is a question: the word that
 * already means the tincture is the one to write, so that a gold roundel comes
 * back as "a besant" and not as "a roundel or", and a blazon reads as an
 * armorial writes it. Failing that, the first word the tincture is allowed under
 * — "a roundel ermine", English having no name for that one — and failing that
 * the canonical word, which will be wrong about the tincture but is at least the
 * charge that was asked for.
 */
export function wordIn<T extends string, W extends Word>(
  translation: Translation<T, W>,
  term: T,
  tincture: Tincture
): W {
  const words = wordsOf(translation, term);
  return (
    words.find((word) => word.defaultTincture === tincture) ??
    words.find((word) => word.accepts(tincture)) ??
    words[0]
  );
}

/**
 * Every spelling a term accepts, the canonical one first.
 *
 * A word may answer to several spellings without being several words, so what is
 * counted here is spellings and not words: "fleur-de-lys" is one of the lily's
 * four and none of them is a word of its own.
 */
export function spellingsOf<T extends string, W extends Word>(
  translation: Translation<T, W>,
  term: T
): readonly string[] {
  return wordsOf(translation, term).flatMap((word) =>
    word.spellings.map((spelling) => spelling.value)
  );
}

/** The spelling a term is written with. */
export function nameOf<T extends string, W extends Word>(
  translation: Translation<T, W>,
  term: T
): string {
  return wordOf(translation, term).value;
}

/**
 * Every way these words may be written, the alternates along with the canonical
 * ones.
 *
 * What a grammar matching a bare word needs is the spellings and not the words:
 * a keyword names no term, so all it can report is that one of them was there.
 */
export function writtenAs(...words: readonly Word[]): readonly string[] {
  return words.flatMap((word) => word.spellings.map((spelling) => spelling.value));
}

/** Which form of a spelling a lookup is keyed on: the one, or the several. */
export type Spelled = (spelling: Spelling) => string;

/** A spelling as one of it, which is how a translation writes it. */
export const asOne: Spelled = (spelling) => spelling.value;

/** A spelling as several of them: "chevrons" for "chevron". */
export const asSeveral: Spelled = (spelling) => spelling.plural;

/**
 * Inverts a translation into a lookup from spelling to term, folded to lower
 * case so that a parser can match however the writer capitalised the word.
 *
 * What a spelling leads to is the word as well as the term, because a grammar
 * that reads a word has to agree with the one actually written rather than with
 * the term's canonical spelling.
 *
 * Which form is looked up is asked for, because a blazon naming several of
 * something names them in the plural, and the plural is a property of the
 * spelling rather than a term of its own.
 *
 * Every spelling a word answers to is indexed, the alternates along with the
 * canonical one: they are the same word and lead to the same word, which is what
 * lets a grammar agree with "fleur-de-lys" exactly as it agrees with the
 * spelling that will be written back.
 */
export function bySpelling<T extends string, W extends Word>(
  translation: Translation<T, W>,
  spelled: Spelled = asOne
): ReadonlyMap<string, TermWord<T, W>> {
  const terms = new Map<string, TermWord<T, W>>();
  for (const term of Object.keys(translation) as T[]) {
    for (const word of wordsOf(translation, term)) {
      for (const spelling of word.spellings) {
        terms.set(spelled(spelling).toLowerCase(), { term, word });
      }
    }
  }
  return terms;
}
