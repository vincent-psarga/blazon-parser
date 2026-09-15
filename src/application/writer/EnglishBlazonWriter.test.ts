import { describe, expect, test } from 'vitest';
import { Blazon } from '../../domain/models/Blazon';
import { DivisionType, VariationType } from '../../domain/models/Field';
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
          ordinaries: [{ type: OrdinaryType.fess, tincture: Metals.or }],
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
          ordinaries: [{ type, tincture: Metals.argent }],
        })
      ).toBe(`Gules ${borne} argent.`);
    });

    test('keeps the article that tells a borne fess from a divided field', () => {
      const borne = writer.write({
        field: { tincture: Colours.azure },
        ordinaries: [{ type: OrdinaryType.fess, tincture: Metals.or }],
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
            ordinaries: [{ type: borne, tincture: Colours.gules }],
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
          ordinaries: [{ type: OrdinaryType.saltire, tincture: Colours.gules }],
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
      ordinaries: [{ type, tincture: Metals.or }],
    };
    expect(roundTrip(blazon)).toEqual(blazon);
  });

  test.each(TINCTURES)('an ordinary of %s survives with its own tincture', (tincture) => {
    const blazon: Blazon = {
      field: { tincture: Colours.sable },
      ordinaries: [{ type: OrdinaryType.fess, tincture }],
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
      ordinaries: [{ type: OrdinaryType.chevron, tincture: Colours.sable }],
    };
    expect(roundTrip(blazon)).toEqual(blazon);
  });
});

describe('several of one ordinary', () => {
  test('writes the count in place of the article, and the name in the plural', () => {
    expect(
      writer.write({
        field: { tincture: Metals.or },
        ordinaries: [{ type: OrdinaryType.chevron, tincture: Colours.gules, count: 2 }],
      })
    ).toBe('Or two chevrons gules.');
  });

  test('pluralises the noun of a name that runs to two words', () => {
    expect(
      writer.write({
        field: { tincture: Metals.or },
        ordinaries: [{ type: OrdinaryType.bendSinister, tincture: Colours.gules, count: 3 }],
      })
    ).toBe('Or three bends sinister gules.');
  });

  test('writes a single band with its article, count or no count', () => {
    expect(
      writer.write({
        field: { tincture: Metals.or },
        ordinaries: [{ type: OrdinaryType.fess, tincture: Colours.gules, count: 1 }],
      })
    ).toBe('Or a fess gules.');
  });

  test('survives the round trip, count and all', () => {
    const blazon: Blazon = {
      field: { tincture: Colours.azure },
      ordinaries: [{ type: OrdinaryType.pale, tincture: Metals.argent, count: 2 }],
    };
    expect(parser.parse(writer.write(blazon))).toEqual(blazon);
  });
});

describe('a field bearing more than one ordinary, in English', () => {
  const ARMS: Blazon = {
    field: { tincture: Metals.or },
    ordinaries: [
      { type: OrdinaryType.bend, tincture: Colours.sable, count: 3 },
      { type: OrdinaryType.bordure, tincture: Colours.gules },
    ],
  };

  test('writes them one after the other, a comma between', () => {
    expect(writer.write(ARMS)).toBe('Or three bends sable, a bordure gules.');
  });

  test('writes them in the order they are laid', () => {
    expect(writer.write({ ...ARMS, ordinaries: [...ARMS.ordinaries!].reverse() })).toBe(
      'Or a bordure gules, three bends sable.'
    );
  });

  test('survives the round trip, the order and all', () => {
    expect(parser.parse(writer.write(ARMS))).toEqual(ARMS);
  });

  test('writes the border back as the bordure blazon spells it', () => {
    expect(writer.write(parser.parse('Argent a border gules'))).toBe('Argent a bordure gules.');
  });
});

describe('a varied field, in English', () => {
  const varied = (type: VariationType, pieces: number): Blazon => ({
    field: { type, firstTincture: Metals.argent, secondTincture: Colours.gules, pieces },
  });

  test('counts the pieces between the name and the tinctures', () => {
    expect(writer.write(varied(VariationType.barry, 6))).toBe('Barry of six argent and gules.');
  });

  test('counts them even where the number is the one the term is understood to have', () => {
    // English states the number of bands before their tinctures, always, where
    // French keeps quiet about the usual six. The same model, written twice.
    expect(writer.write(varied(VariationType.bendy, 6))).toBe('Bendy of six argent and gules.');
    expect(writer.write(varied(VariationType.bendy, 8))).toBe('Bendy of eight argent and gules.');
  });

  test.each([
    [VariationType.barry, 'Barry'],
    [VariationType.paly, 'Paly'],
    [VariationType.bendy, 'Bendy'],
    [VariationType.pily, 'Pily'],
    [VariationType.chevronny, 'Chevronny'],
  ])('names %s in English', (type, name) => {
    expect(writer.write(varied(type, 6))).toBe(`${name} of six argent and gules.`);
  });

  test('survives the round trip, the count and all', () => {
    for (const type of Object.values(VariationType)) {
      const blazon = varied(type, 8);
      expect(parser.parse(writer.write(blazon))).toEqual(blazon);
    }
  });

  test('writes the longer name of the pily back as the short one', () => {
    expect(writer.write(parser.parse('Pily counter pily of six argent and gules'))).toBe(
      'Pily of six argent and gules.'
    );
  });

  test('writes what it bears after the pieces it is cut into', () => {
    expect(writer.write(parser.parse('Bendy of eight or and azure a bordure gules'))).toBe(
      'Bendy of eight or and azure a bordure gules.'
    );
  });
});
