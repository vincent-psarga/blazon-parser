import { Translation, wordOf } from './Translation';
import { Word } from './Word';

/**
 * How a language counts what a field bears.
 *
 * A number is not a heraldic term: nothing about "three" belongs to heraldry,
 * and the model holds the number itself rather than a term standing for it. What
 * a language contributes is only the word — "trois", "three" — so the translation
 * is keyed on the number as it is written in figures.
 *
 * It runs as far as a blazon plausibly counts and no further. Beyond that the
 * figure is written instead, which is a poor blazon but an honest one: better a
 * number nobody spelled than a number spelled wrong.
 */
export type NumberWords<W extends Word = Word> = Translation<`${number}`, W>;

/** The word a language counts that many with, where it has one. */
export function numberWord<W extends Word>(numbers: NumberWords<W>, count: number): W | undefined {
  return numbers[`${count}`] === undefined ? undefined : wordOf(numbers, `${count}`);
}

/** How many, in the language's own word for it, or in figures where it has none. */
export function counted<W extends Word>(numbers: NumberWords<W>, count: number): string {
  return numberWord(numbers, count)?.value ?? `${count}`;
}
