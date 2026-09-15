import { describe, expect, test } from 'vitest';
import { counted, numberWord } from './Numbers';
import { spellingsOf } from './Translation';
import { EnglishNumbers } from './en/Numbers';
import { FrenchNumbers } from './fr/Numbers';

const VOCABULARIES = [
  ['French', FrenchNumbers],
  ['English', EnglishNumbers],
] as const;

describe('counting in words', () => {
  test('spells the numbers a blazon counts with', () => {
    expect(counted(FrenchNumbers, 3)).toBe('trois');
    expect(counted(EnglishNumbers, 3)).toBe('three');
  });

  test.each(VOCABULARIES)('%s counts from two, one being named without a number', (_, numbers) => {
    expect(numberWord(numbers, 1)).toBeUndefined();
    expect(numberWord(numbers, 2)).toBeDefined();
  });

  test.each(VOCABULARIES)('%s falls back on the figure beyond what it names', (_, numbers) => {
    expect(numberWord(numbers, 17)).toBeUndefined();
    expect(counted(numbers, 17)).toBe('17');
  });

  test.each(VOCABULARIES)('%s names each number once, and only in letters', (_, numbers) => {
    const words = Object.keys(numbers).flatMap((count) =>
      spellingsOf(numbers, count as `${number}`)
    );
    expect(new Set(words).size).toBe(words.length);
    // A hyphen is where each language stops: the lexer reads letters, so a
    // number written "dix-sept" would never reach the grammar as one word.
    expect(words.every((word) => /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(word))).toBe(true);
  });

  test.each(VOCABULARIES)('%s counts every number up to the one it stops at', (_, numbers) => {
    const counts = Object.keys(numbers).map(Number);
    expect(counts).toEqual(Array.from({ length: 15 }, (_, step) => step + 2));
  });
});
