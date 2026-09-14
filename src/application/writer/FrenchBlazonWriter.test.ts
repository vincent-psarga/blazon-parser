import { describe, expect, test } from 'vitest';
import { Blazon } from '../../domain/models/Blazon';
import { DivisionType } from '../../domain/models/Field';
import { OrdinaryType } from '../../domain/models/Ordinary';
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

  describe('a field bearing an ordinary', () => {
    test('writes the ordinary after the field, in its own tincture', () => {
      expect(
        writer.write({
          field: { tincture: Colours.azure },
          ordinary: { type: OrdinaryType.fess, tincture: Metals.or },
        })
      ).toBe("D'azur à la fasce d'or.");
    });

    test.each([
      [OrdinaryType.chief, 'au chef'],
      [OrdinaryType.pale, 'au pal'],
      [OrdinaryType.fess, 'à la fasce'],
      [OrdinaryType.bend, 'à la bande'],
      [OrdinaryType.bendSinister, 'à la barre'],
      [OrdinaryType.chevron, 'au chevron'],
      [OrdinaryType.cross, 'à la croix'],
      [OrdinaryType.saltire, 'au sautoir'],
    ])('agrees the article with %s', (type, borne) => {
      expect(
        writer.write({
          field: { tincture: Colours.gules },
          ordinary: { type, tincture: Metals.argent },
        })
      ).toBe(`De gueules ${borne} d'argent.`);
    });

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
      ).toBe("Parti d'azur et d'or au sautoir de gueules.");
    });

    test('closes the sentence after what the field bears, not before', () => {
      const written = writer.write({
        field: { tincture: Colours.vert },
        ordinary: { type: OrdinaryType.chevron, tincture: Metals.or },
      });
      expect(written.endsWith("d'or.")).toBe(true);
      expect(written.slice(0, -1)).not.toContain('.');
    });
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

  test.each(["d'azur", 'DE GUEULES', "parti d'azur et d'or.", 'Coupé de sinople et de sable'])(
    'normalises %s without changing what it means',
    (text) => {
      const once = parser.parse(text);
      expect(parser.parse(writer.write(once))).toEqual(once);
    }
  );

  test('keeps the bande apart from the tranché it runs along', () => {
    expect(
      writer.write({
        field: { tincture: Colours.azure },
        ordinary: { type: OrdinaryType.bend, tincture: Metals.or },
      })
    ).toBe("D'azur à la bande d'or.");
    expect(
      writer.write({
        field: { type: DivisionType.bend, firstTincture: Colours.azure, secondTincture: Metals.or },
      })
    ).toBe("Tranché d'azur et d'or.");
  });

  test('normalises a blazon whose ordinary was written with the wrong case', () => {
    const once = parser.parse("D'AZUR AU SAUTOIR DE GUEULES");
    expect(writer.write(once)).toBe("D'azur au sautoir de gueules.");
  });
});
