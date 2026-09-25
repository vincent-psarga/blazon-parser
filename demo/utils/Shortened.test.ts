import { describe, expect, test } from 'vitest';
import { GLIMPSE, shortened } from './Shortened';

describe('shortened', () => {
  test('leaves a passage that fits exactly as it stands', () => {
    expect(shortened('A star of five straight rays.', 40)).toBe('A star of five straight rays.');
  });

  test('leaves a passage the length of the room itself', () => {
    const exact = 'a'.repeat(20);
    expect(shortened(exact, 20)).toBe(exact);
  });

  test('breaks a long passage at a word, and says it was broken', () => {
    expect(shortened('A star of five straight rays, the rowel of a spur.', 20)).toBe(
      'A star of five…'
    );
  });

  test('never comes back longer than the room it was given', () => {
    const long = 'word '.repeat(80);
    for (const limit of [8, 20, 60, GLIMPSE]) {
      expect(shortened(long, limit).length).toBeLessThanOrEqual(limit);
    }
  });

  test('takes the punctuation of the clause it broke off with it', () => {
    // "rays," ends a clause that no longer has an end, so the comma goes too.
    expect(shortened('A star of five straight rays, the rowel of a spur.', 30)).toBe(
      'A star of five straight rays…'
    );
  });

  test('breaks within a word only where there is no word to break at', () => {
    expect(shortened('abcdefghijklmnop', 6)).toBe('abcde…');
  });
});
