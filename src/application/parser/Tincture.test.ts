import { describe, expect, test } from 'vitest';
import { Colours, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { nameOf } from '../../domain/translations/Translation';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { withArticle } from '../french/FrenchGrammar';
import { parseTincture } from './Parser';

const inFrench = (tincture: (typeof TINCTURES)[number]) => nameOf(FrenchTinctures, tincture);

describe('parseTincture', () => {
  test.each(TINCTURES)('parses %s bare', (tincture) => {
    expect(parseTincture(inFrench(tincture))).toBe(tincture);
  });

  test.each(TINCTURES)('parses %s with its article', (tincture) => {
    expect(parseTincture(withArticle(inFrench(tincture)))).toBe(tincture);
  });

  test('is case insensitive', () => {
    expect(parseTincture('  Azur ')).toBe(Colours.azure);
  });

  test('rejects an unknown tincture', () => {
    expect(() => parseTincture('Fuchsia')).toThrow(/Unknown tincture/);
  });

  describe('articles', () => {
    test('accepts a typographic apostrophe', () => {
      expect(parseTincture('d’or')).toBe(Metals.gold);
    });

    test('ignores the spacing after "de"', () => {
      expect(parseTincture('De   Gueules')).toBe(Colours.gules);
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
    expect(withArticle(inFrench(Metals.gold))).toBe("d'or");
    expect(withArticle(inFrench(Metals.silver))).toBe("d'argent");
    expect(withArticle(inFrench(Colours.azure))).toBe("d'azur");
  });

  test('keeps "de" before a consonant', () => {
    expect(withArticle(inFrench(Colours.gules))).toBe('de gueules');
    expect(withArticle(inFrench(Colours.sable))).toBe('de sable');
    expect(withArticle(inFrench(Colours.vert))).toBe('de sinople');
  });
});
