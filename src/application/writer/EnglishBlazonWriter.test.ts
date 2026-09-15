import { describe, expect, test } from 'vitest';
import { Blazon } from '../../domain/models/Blazon';
import { DivisionType } from '../../domain/models/Field';
import { OrdinaryType } from '../../domain/models/Ordinary';
import { Colours, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { EnglishBlazonParser } from '../parser/EnglishBlazonParser';
import { EnglishBlazonWriter } from './EnglishBlazonWriter';

const writer = new EnglishBlazonWriter();
const parser = new EnglishBlazonParser();

describe('EnglishBlazonWriter', () => {
  test('writes a plain field', () => {
    expect(writer.write({ field: { tincture: Colours.azure } })).toBe('Azure.');
  });

  test('writes a divided field', () => {
    expect(
      writer.write({
        field: {
          type: DivisionType.pale,
          firstTincture: Colours.azure,
          secondTincture: Metals.or,
        },
      })
    ).toBe('Per pale azure and or.');
  });

  test.each([
    [DivisionType.fess, 'Per fess'],
    [DivisionType.bend, 'Per bend'],
    [DivisionType.bendSinister, 'Per bend sinister'],
  ])('names %s in English', (type, name) => {
    const written = writer.write({
      field: { type, firstTincture: Colours.gules, secondTincture: Metals.argent },
    });
    expect(written).toBe(`${name} gules and argent.`);
  });

  test('introduces a tincture bare, with no article', () => {
    expect(writer.write({ field: { tincture: Metals.or } })).toBe('Or.');
    expect(writer.write({ field: { tincture: Colours.gules } })).toBe('Gules.');
  });

  describe('a field bearing an ordinary', () => {
    test('writes the ordinary after the field, in its own tincture', () => {
      expect(
        writer.write({
          field: { tincture: Colours.azure },
          ordinary: { type: OrdinaryType.fess, tincture: Metals.or },
        })
      ).toBe('Azure a fess or.');
    });

    test.each([
      [OrdinaryType.chief, 'a chief'],
      [OrdinaryType.pale, 'a pale'],
      [OrdinaryType.fess, 'a fess'],
      [OrdinaryType.bend, 'a bend'],
      [OrdinaryType.bendSinister, 'a bend sinister'],
      [OrdinaryType.chevron, 'a chevron'],
      [OrdinaryType.cross, 'a cross'],
      [OrdinaryType.saltire, 'a saltire'],
    ])('names %s as "%s"', (type, borne) => {
      expect(
        writer.write({
          field: { tincture: Colours.gules },
          ordinary: { type, tincture: Metals.argent },
        })
      ).toBe(`Gules ${borne} argent.`);
    });

    test('keeps the article that tells a borne fess from a divided field', () => {
      const borne = writer.write({
        field: { tincture: Colours.azure },
        ordinary: { type: OrdinaryType.fess, tincture: Metals.or },
      });
      const divided = writer.write({
        field: {
          type: DivisionType.fess,
          firstTincture: Colours.azure,
          secondTincture: Metals.or,
        },
      });
      expect(borne).toBe('Azure a fess or.');
      expect(divided).toBe('Per fess azure and or.');
    });

    test.each([
      [OrdinaryType.pale, DivisionType.pale, 'a pale', 'Per pale'],
      [OrdinaryType.fess, DivisionType.fess, 'a fess', 'Per fess'],
      [OrdinaryType.bend, DivisionType.bend, 'a bend', 'Per bend'],
      [
        OrdinaryType.bendSinister,
        DivisionType.bendSinister,
        'a bend sinister',
        'Per bend sinister',
      ],
    ])(
      'keeps %s borne apart from the partition of the same name',
      (borne, divides, article, per) => {
        expect(
          writer.write({
            field: { tincture: Metals.argent },
            ordinary: { type: borne, tincture: Colours.gules },
          })
        ).toBe(`Argent ${article} gules.`);
        expect(
          writer.write({
            field: {
              type: divides,
              firstTincture: Metals.argent,
              secondTincture: Colours.gules,
            },
          })
        ).toBe(`${per} argent and gules.`);
      }
    );

    test('writes an ordinary laid on a divided field', () => {
      expect(
        writer.write({
          field: {
            type: DivisionType.pale,
            firstTincture: Colours.azure,
            secondTincture: Metals.or,
          },
          ordinary: { type: OrdinaryType.saltire, tincture: Colours.gules },
        })
      ).toBe('Per pale azure and or a saltire gules.');
    });
  });
});

describe('round trip', () => {
  const roundTrip = (blazon: Blazon) => parser.parse(writer.write(blazon));

  test.each(TINCTURES)('a plain field of %s survives being written and read back', (tincture) => {
    const blazon: Blazon = { field: { tincture } };
    expect(roundTrip(blazon)).toEqual(blazon);
  });

  test.each(Object.values(DivisionType))(
    'a field divided per %s survives the round trip',
    (type) => {
      const blazon: Blazon = {
        field: { type, firstTincture: Colours.sable, secondTincture: Metals.or },
      };
      expect(roundTrip(blazon)).toEqual(blazon);
    }
  );

  test.each(Object.values(OrdinaryType))('a field bearing %s survives the round trip', (type) => {
    const blazon: Blazon = {
      field: { tincture: Colours.azure },
      ordinary: { type, tincture: Metals.or },
    };
    expect(roundTrip(blazon)).toEqual(blazon);
  });

  test.each(TINCTURES)('an ordinary of %s survives with its own tincture', (tincture) => {
    const blazon: Blazon = {
      field: { tincture: Colours.sable },
      ordinary: { type: OrdinaryType.fess, tincture },
    };
    expect(roundTrip(blazon)).toEqual(blazon);
  });

  test('a divided field bearing an ordinary survives the round trip', () => {
    const blazon: Blazon = {
      field: {
        type: DivisionType.bend,
        firstTincture: Colours.gules,
        secondTincture: Metals.argent,
      },
      ordinary: { type: OrdinaryType.chevron, tincture: Colours.sable },
    };
    expect(roundTrip(blazon)).toEqual(blazon);
  });
});

describe('several of one ordinary', () => {
  test('writes the count in place of the article, and the name in the plural', () => {
    expect(
      writer.write({
        field: { tincture: Metals.or },
        ordinary: { type: OrdinaryType.chevron, tincture: Colours.gules, count: 2 },
      })
    ).toBe('Or two chevrons gules.');
  });

  test('pluralises the noun of a name that runs to two words', () => {
    expect(
      writer.write({
        field: { tincture: Metals.or },
        ordinary: { type: OrdinaryType.bendSinister, tincture: Colours.gules, count: 3 },
      })
    ).toBe('Or three bends sinister gules.');
  });

  test('writes a single band with its article, count or no count', () => {
    expect(
      writer.write({
        field: { tincture: Metals.or },
        ordinary: { type: OrdinaryType.fess, tincture: Colours.gules, count: 1 },
      })
    ).toBe('Or a fess gules.');
  });

  test('survives the round trip, count and all', () => {
    const blazon: Blazon = {
      field: { tincture: Colours.azure },
      ordinary: { type: OrdinaryType.pale, tincture: Metals.argent, count: 2 },
    };
    expect(parser.parse(writer.write(blazon))).toEqual(blazon);
  });
});
