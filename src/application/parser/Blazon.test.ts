import { describe, expect, test } from 'vitest';
import { parseBlazon } from './Parser';
import { withArticle } from './Tincture';
import { TINCTURES } from '../../domain/models/Tinctures';

describe('parseBlazon', () => {
  test.each(TINCTURES)('reads a field %s into the blazon', (tincture) => {
    expect(parseBlazon(withArticle(tincture))).toEqual({ field: { tincture } });
  });

  test('accepts a field named without its article', () => {
    expect(parseBlazon('azur')).toEqual({ field: { tincture: 'azur' } });
  });

  test('accepts the capitalisation a blazon is written with', () => {
    expect(parseBlazon("D'Or")).toEqual({ field: { tincture: 'or' } });
  });

  test('rejects an unknown tincture', () => {
    expect(() => parseBlazon('de fuchsia')).toThrow(/Unknown tincture: fuchsia/);
  });

  test('rejects a wrong elision', () => {
    expect(() => parseBlazon('de or')).toThrow(/expected "d'or"/);
  });

  describe('the closing full stop', () => {
    test('accepts a blazon that ends with one', () => {
      expect(parseBlazon("D'azur.")).toEqual({ field: { tincture: 'azur' } });
    });

    test('accepts a blazon that omits it', () => {
      expect(parseBlazon("D'azur")).toEqual({ field: { tincture: 'azur' } });
    });

    test('rejects a doubled stop', () => {
      expect(() => parseBlazon("D'azur..")).toThrow();
    });

    test('rejects a stop on its own', () => {
      expect(() => parseBlazon('.')).toThrow();
    });

    test('rejects a stop before the field', () => {
      expect(() => parseBlazon(".D'azur")).toThrow();
    });
  });
});
