import { describe, expect, test } from 'vitest';
import { DivisionType } from '../../domain/models/Field';
import { Colours, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { nameOf } from '../../domain/translations/Translation';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { EnglishBlazonParser } from './EnglishBlazonParser';
import { FrenchBlazonParser } from './FrenchBlazonParser';

const parser = new EnglishBlazonParser();

describe('EnglishBlazonParser', () => {
  test.each(TINCTURES)('reads a plain field of %s', (tincture) => {
    expect(parser.parse(nameOf(EnglishTinctures, tincture))).toEqual({ field: { tincture } });
  });

  test('reads a divided field', () => {
    expect(parser.parse('Per pale azure and or.')).toEqual({
      field: {
        type: DivisionType.pale,
        firstTincture: Colours.azure,
        secondTincture: Metals.gold,
      },
    });
  });

  test.each([
    ['Per fess', DivisionType.fess],
    ['Per bend', DivisionType.bend],
    ['Per bend sinister', DivisionType.bendSinister],
  ])('reads "%s" as a field divided per that line', (name, type) => {
    expect(parser.parse(`${name} gules and argent`)).toEqual({
      field: { type, firstTincture: Colours.gules, secondTincture: Metals.silver },
    });
  });

  test('prefers the longer division name over the shorter one it starts with', () => {
    const blazon = parser.parse('Per bend sinister sable and or');
    expect(blazon.field).toMatchObject({ type: DivisionType.bendSinister });
  });

  test('is case insensitive', () => {
    expect(parser.parse('PER PALE AZURE AND OR')).toEqual({
      field: { type: DivisionType.pale, firstTincture: Colours.azure, secondTincture: Metals.gold },
    });
  });

  test('takes the closing full stop or leaves it', () => {
    expect(parser.parse('Vert.')).toEqual(parser.parse('Vert'));
  });

  describe('rejections', () => {
    test('rejects a tincture it does not know', () => {
      expect(() => parser.parse('Fuchsia')).toThrow(/Unknown tincture: fuchsia/);
    });

    test('rejects a French blazon', () => {
      expect(() => parser.parse("D'azur")).toThrow();
      expect(() => parser.parse("Parti d'azur et d'or")).toThrow();
    });

    test('rejects a division naming only one tincture', () => {
      expect(() => parser.parse('Per pale azure')).toThrow();
    });

    test('rejects two tinctures without "and"', () => {
      expect(() => parser.parse('Per pale azure or')).toThrow();
    });

    test('rejects a division without its "per"', () => {
      expect(() => parser.parse('Pale azure and or')).toThrow();
    });
  });
});

describe('reading the same arms in either language', () => {
  const french = new FrenchBlazonParser();

  test('English and French agree on what a blazon means', () => {
    expect(parser.parse('Per pale azure and or')).toEqual(french.parse("Parti d'azur et d'or"));
    expect(parser.parse('Vert')).toEqual(french.parse('De sinople'));
    expect(parser.parse('Per fess gules and argent')).toEqual(
      french.parse('Coupé de gueules et d\'argent')
    );
  });
});
