import { describe, expect, test } from 'vitest';
import { parseTincture, TINCTURES, withArticle } from './Parser';

describe('parseTincture', () => {
  test.each(TINCTURES)('parses %s bare', (tincture) => {
    expect(parseTincture(tincture)).toBe(tincture);
  });

  test.each(TINCTURES)('parses %s with its article', (tincture) => {
    expect(parseTincture(withArticle(tincture))).toBe(tincture);
  });

  test('is case insensitive', () => {
    expect(parseTincture('  Azur ')).toBe('azur');
  });

  test('rejects an unknown tincture', () => {
    expect(() => parseTincture('Fuchsia')).toThrow(/Unknown tincture/);
  });

  describe('articles', () => {
    test('accepts a typographic apostrophe', () => {
      expect(parseTincture('d’or')).toBe('or');
    });

    test('ignores the spacing after "de"', () => {
      expect(parseTincture('De   Gueules')).toBe('gueules');
    });

    test('rejects "de" where the vowel calls for an elision', () => {
      expect(() => parseTincture('de or')).toThrow(/expected "d'or"/);
    });

    test('rejects an elision where the consonant calls for "de"', () => {
      expect(() => parseTincture("d'gueules")).toThrow(/expected "de gueules"/);
    });
  });

  test('lexes "dextre" as a single word, not "de" + "xtre"', () => {
    expect(() => parseTincture('dextre')).toThrow(/Unknown tincture: dextre/);
  });
});

describe('withArticle', () => {
  test('elides before a vowel', () => {
    expect(withArticle('or')).toBe("d'or");
    expect(withArticle('argent')).toBe("d'argent");
    expect(withArticle('azur')).toBe("d'azur");
  });

  test('keeps "de" before a consonant', () => {
    expect(withArticle('gueules')).toBe('de gueules');
    expect(withArticle('sable')).toBe('de sable');
    expect(withArticle('sinople')).toBe('de sinople');
  });
});
