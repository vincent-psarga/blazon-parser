import { describe, expect, test } from 'vitest';
import { DivisionType } from '../../domain/models/Field';
import { OrdinaryType } from '../../domain/models/Ordinary';
import { MissingTincture } from '../../domain/errors/parsing/MissingTincture';
import { RepeatedOrdinary } from '../../domain/errors/parsing/RepeatedOrdinary';
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

describe('a field bearing several of one ordinary', () => {
  test('reads "Or three chevrons gules" as three chevrons on an or field', () => {
    expect(parser.parse('Or three chevrons gules')).toEqual({
      field: { tincture: Metals.or },
      ordinary: { type: OrdinaryType.chevron, tincture: Colours.gules, count: 3 },
    });
  });

  test.each([
    ['two pales', OrdinaryType.pale, 2],
    ['three fesses', OrdinaryType.fess, 3],
    ['three bars gemel', OrdinaryType.barGemel, 3],
    ['four bends', OrdinaryType.bend, 4],
    ['six bends sinister', OrdinaryType.bendSinister, 6],
    ['sixteen chevrons', OrdinaryType.chevron, 16],
  ])('reads "%s" as that many of that ordinary', (borne, type, count) => {
    expect(parser.parse(`Azure ${borne} or`).ordinary).toEqual({
      type,
      tincture: Metals.or,
      count,
    });
  });

  test('names the count with nothing in front of it, where one takes an article', () => {
    expect(parser.parse('Or a chevron gules').ordinary).not.toHaveProperty('count');
    expect(() => parser.parse('Or a three chevrons gules')).toThrow();
  });

  test('reads the count in figures as readily as in words', () => {
    expect(parser.parse('Or 3 chevrons gules')).toEqual(parser.parse('Or three chevrons gules'));
  });

  test('closes with the optional full stop, and is read whatever its case', () => {
    expect(parser.parse('OR THREE CHEVRONS GULES.')).toEqual(
      parser.parse('Or three chevrons gules')
    );
  });

  describe('rejections', () => {
    test.each(['chiefs', 'crosses', 'saltires'])('refuses several %s, borne but once', (word) => {
      expect(() => parser.parse(`Or two ${word} gules`)).toThrow(RepeatedOrdinary);
    });

    test('refuses a count of one', () => {
      expect(() => parser.parse('Or 1 chevrons gules')).toThrow(/not more than one/);
      expect(() => parser.parse('Or one chevrons gules')).toThrow();
    });

    test('refuses the singular name after a count', () => {
      expect(() => parser.parse('Or two chevron gules')).toThrow(UnknownOrdinary);
    });

    test('refuses a word that is no number at all', () => {
      expect(() => parser.parse('Or many chevrons gules')).toThrow();
    });

    test('still owes them a tincture of their own', () => {
      expect(() => parser.parse('Or two chevrons')).toThrow(MissingTincture);
    });
  });
});

describe('the bar gemel', () => {
  test('reads a name of two words, and the noun that pluralises inside it', () => {
    expect(parser.parse('Argent a bar gemel gules').ordinary).toEqual({
      type: OrdinaryType.barGemel,
      tincture: Colours.gules,
    });
    expect(parser.parse('Argent three bars gemel gules').ordinary).toEqual({
      type: OrdinaryType.barGemel,
      tincture: Colours.gules,
      count: 3,
    });
  });

  test('is not read from the plural spelled the easy way', () => {
    expect(() => parser.parse('Argent three bar gemels gules')).toThrow();
  });
});
