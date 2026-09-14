import { describe, expect, test } from 'vitest';
import { Blazon } from '../../domain/models/Blazon';
import { DivisionType } from '../../domain/models/Field';
import { Colours, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { FrenchBlazonParser } from '../parser/FrenchBlazonParser';
import { FrenchBlazonWriter } from './FrenchBlazonWriter';

const writer = new FrenchBlazonWriter();
const parser = new FrenchBlazonParser();

describe('FrenchBlazonWriter', () => {
  test('writes a plain field', () => {
    expect(writer.write({ field: { tincture: Colours.azure } })).toBe("D'azur.");
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
    ).toBe("Parti d'azur et d'or.");
  });

  test.each([
    [DivisionType.fess, 'Coupé'],
    [DivisionType.bend, 'Tranché'],
    [DivisionType.bendSinister, 'Taillé'],
  ])('names %s in French', (type, name) => {
    const written = writer.write({
      field: { type, firstTincture: Colours.gules, secondTincture: Metals.argent },
    });
    expect(written).toBe(`${name} de gueules et d'argent.`);
  });

  test('agrees the article with the tincture it introduces', () => {
    expect(writer.write({ field: { tincture: Metals.or } })).toBe("D'or.");
    expect(writer.write({ field: { tincture: Colours.gules } })).toBe('De gueules.');
  });

  test('opens with a capital and closes with a full stop', () => {
    const written = writer.write({ field: { tincture: Colours.vert } });
    expect(written.charAt(0)).toBe(written.charAt(0).toUpperCase());
    expect(written.endsWith('.')).toBe(true);
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

  test.each(["d'azur", 'DE GUEULES', "parti d'azur et d'or.", 'Coupé de sinople et de sable'])(
    'normalises %s without changing what it means',
    (text) => {
      const once = parser.parse(text);
      expect(parser.parse(writer.write(once))).toEqual(once);
    }
  );
});
