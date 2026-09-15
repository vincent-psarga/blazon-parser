import { describe, expect, test } from 'vitest';
import { DivisionType } from '../../domain/models/Field';
import { OrdinaryType } from '../../domain/models/Ordinary';
import { MissingTincture } from '../../domain/errors/parsing/MissingTincture';
import { UnknownOrdinary } from '../../domain/errors/parsing/UnknownOrdinary';
import { UnknownDivision } from '../../domain/errors/parsing/UnknownDivision';
import { UnknownTincture } from '../../domain/errors/parsing/UnknownTincture';
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
        secondTincture: Metals.or,
      },
    });
  });

  test.each([
    ['Per fess', DivisionType.fess],
    ['Per bend', DivisionType.bend],
    ['Per bend sinister', DivisionType.bendSinister],
  ])('reads "%s" as a field divided per that line', (name, type) => {
    expect(parser.parse(`${name} gules and argent`)).toEqual({
      field: { type, firstTincture: Colours.gules, secondTincture: Metals.argent },
    });
  });

  test('prefers the longer division name over the shorter one it starts with', () => {
    const blazon = parser.parse('Per bend sinister sable and or');
    expect(blazon.field).toMatchObject({ type: DivisionType.bendSinister });
  });

  test('is case insensitive', () => {
    expect(parser.parse('PER PALE AZURE AND OR')).toEqual({
      field: { type: DivisionType.pale, firstTincture: Colours.azure, secondTincture: Metals.or },
    });
  });

  test('takes the closing full stop or leaves it', () => {
    expect(parser.parse('Vert.')).toEqual(parser.parse('Vert'));
  });

  describe('a field bearing an ordinary', () => {
    test('reads "Azure a fess or" as a fess on an azure field', () => {
      expect(parser.parse('Azure a fess or')).toEqual({
        field: { tincture: Colours.azure },
        ordinary: { type: OrdinaryType.fess, tincture: Metals.or },
      });
    });

    test.each([
      ['chief', OrdinaryType.chief],
      ['pale', OrdinaryType.pale],
      ['fess', OrdinaryType.fess],
      ['bend', OrdinaryType.bend],
      ['bend sinister', OrdinaryType.bendSinister],
      ['chevron', OrdinaryType.chevron],
      ['cross', OrdinaryType.cross],
      ['saltire', OrdinaryType.saltire],
    ])('reads "a %s" as that ordinary', (name, type) => {
      expect(parser.parse(`Gules a ${name} argent`)).toEqual({
        field: { tincture: Colours.gules },
        ordinary: { type, tincture: Metals.argent },
      });
    });

    test('tells "a fess" laid on a field from "per fess" dividing one', () => {
      expect(parser.parse('Azure a fess or').field).toEqual({ tincture: Colours.azure });
      expect(parser.parse('Per fess azure and or')).not.toHaveProperty('ordinary');
    });

    test('lays an ordinary on a divided field', () => {
      expect(parser.parse('Per pale azure and or a saltire gules')).toEqual({
        field: {
          type: DivisionType.pale,
          firstTincture: Colours.azure,
          secondTincture: Metals.or,
        },
        ordinary: { type: OrdinaryType.saltire, tincture: Colours.gules },
      });
    });

    test('rejects an ordinary named without its article', () => {
      expect(() => parser.parse('Azure fess or')).toThrow();
    });

    test('rejects an ordinary the vocabulary does not know', () => {
      expect(() => parser.parse('Azure a bordure or')).toThrow(UnknownOrdinary);
      expect(() => parser.parse('Azure a bordure or')).toThrow(/Unknown ordinary: bordure/);
    });

    test('prefers the longer ordinary name over the shorter one it starts with', () => {
      expect(parser.parse('Argent a bend sinister gules').ordinary).toMatchObject({
        type: OrdinaryType.bendSinister,
      });
      expect(parser.parse('Argent a bend gules').ordinary).toMatchObject({
        type: OrdinaryType.bend,
      });
    });

    test.each([
      ['pale', OrdinaryType.pale],
      ['fess', OrdinaryType.fess],
      ['bend', OrdinaryType.bend],
      ['bend sinister', OrdinaryType.bendSinister],
    ])('tells "a %s" borne from "per %s" dividing', (name, type) => {
      expect(parser.parse(`Argent a ${name} gules`).ordinary).toMatchObject({ type });
      expect(parser.parse(`Per ${name} argent and gules`)).not.toHaveProperty('ordinary');
    });

    test('rejects an ordinary with no tincture of its own, as a missing tincture', () => {
      expect(() => parser.parse('Azure a fess')).toThrow(MissingTincture);
    });
  });

  describe('rejections', () => {
    test('rejects a tincture it does not know', () => {
      expect(() => parser.parse('Fuchsia')).toThrow(UnknownTincture);
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

    test('rejects a division without its "per", as a division it does not hold', () => {
      expect(() => parser.parse('Pale azure and or')).toThrow(UnknownDivision);
      expect(() => parser.parse('Pale azure and or')).toThrow(/Unknown division: pale/);
    });
  });
});

describe('reading the same arms in either language', () => {
  const french = new FrenchBlazonParser();

  test('English and French agree on what a blazon means', () => {
    expect(parser.parse('Per pale azure and or')).toEqual(french.parse("Parti d'azur et d'or"));
    expect(parser.parse('Vert')).toEqual(french.parse('De sinople'));
    expect(parser.parse('Per fess gules and argent')).toEqual(
      french.parse("Coupé de gueules et d'argent")
    );
  });

  test('agree on a field bearing an ordinary', () => {
    expect(parser.parse('Azure a fess or')).toEqual(french.parse("D'azur à la fasce d'or"));
    expect(parser.parse('Gules a chevron argent')).toEqual(
      french.parse("De gueules au chevron d'argent")
    );
    expect(parser.parse('Or a saltire sable')).toEqual(french.parse("D'or au sautoir de sable"));
    expect(parser.parse('Argent a bend gules')).toEqual(
      french.parse("D'argent à la bande de gueules")
    );
    expect(parser.parse('Argent a bend sinister gules')).toEqual(
      french.parse("D'argent à la barre de gueules")
    );
    expect(parser.parse('Azure a chief or')).toEqual(french.parse("D'azur au chef d'or"));
    expect(parser.parse('Azure a pale or')).toEqual(french.parse("D'azur au pal d'or"));
    expect(parser.parse('Argent a cross gules')).toEqual(
      french.parse("D'argent à la croix de gueules")
    );
  });
});
