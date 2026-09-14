import { describe, expect, test } from 'vitest';
import { Blazon } from '../../domain/models/Blazon';
import { DivisionType } from '../../domain/models/Field';
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
          secondTincture: Metals.gold,
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
      field: { type, firstTincture: Colours.gules, secondTincture: Metals.silver },
    });
    expect(written).toBe(`${name} gules and argent.`);
  });

  test('introduces a tincture bare, with no article', () => {
    expect(writer.write({ field: { tincture: Metals.gold } })).toBe('Or.');
    expect(writer.write({ field: { tincture: Colours.gules } })).toBe('Gules.');
  });
});

describe('round trip', () => {
  const roundTrip = (blazon: Blazon) => parser.parse(writer.write(blazon));

  test.each(TINCTURES)('a plain field of %s survives being written and read back', (tincture) => {
    const blazon: Blazon = { field: { tincture } };
    expect(roundTrip(blazon)).toEqual(blazon);
  });

  test.each(Object.values(DivisionType))('a field divided per %s survives the round trip', (type) => {
    const blazon: Blazon = {
      field: { type, firstTincture: Colours.sable, secondTincture: Metals.gold },
    };
    expect(roundTrip(blazon)).toEqual(blazon);
  });
});
