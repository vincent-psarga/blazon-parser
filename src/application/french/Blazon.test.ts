import { describe, expect, test } from 'vitest';
import { FrenchBlazonParser } from '../parser/FrenchBlazonParser';
import { withArticle } from './FrenchGrammar';
import { Colours, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { nameOf } from '../../domain/translations/Translation';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';

const parser = new FrenchBlazonParser();

describe('parseBlazon', () => {
  test.each(TINCTURES)('reads a field %s into the blazon', (tincture) => {
    expect(parser.parse(withArticle(nameOf(FrenchTinctures, tincture)))).toEqual({
      field: { tincture },
    });
  });

  test('accepts a field named without its article', () => {
    expect(parser.parse('azur')).toEqual({ field: { tincture: Colours.azure } });
  });

  test('accepts the capitalisation a blazon is written with', () => {
    expect(parser.parse("D'Or")).toEqual({ field: { tincture: Metals.or } });
  });

  test('rejects an unknown tincture', () => {
    expect(() => parser.parse('de fuchsia')).toThrow(/Unknown tincture: fuchsia/);
  });

  test('rejects a wrong elision', () => {
    expect(() => parser.parse('de or')).toThrow(/expected "d'or"/);
  });

  describe('the closing full stop', () => {
    test('accepts a blazon that ends with one', () => {
      expect(parser.parse("D'azur.")).toEqual({ field: { tincture: Colours.azure } });
    });

    test('accepts a blazon that omits it', () => {
      expect(parser.parse("D'azur")).toEqual({ field: { tincture: Colours.azure } });
    });

    test('rejects a doubled stop', () => {
      expect(() => parser.parse("D'azur..")).toThrow();
    });

    test('rejects a stop on its own', () => {
      expect(() => parser.parse('.')).toThrow();
    });

    test('rejects a stop before the field', () => {
      expect(() => parser.parse(".D'azur")).toThrow();
    });
  });
});
