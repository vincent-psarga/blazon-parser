import { describe, expect, test } from 'vitest';
import { FrenchBlazonParser } from '../parser/FrenchBlazonParser';
import { FrenchBlazonWriter } from '../writer/FrenchBlazonWriter';
import { ChargeType } from '../../domain/models/Charge';
import { OrdinaryType } from '../../domain/models/Ordinary';
import { FieldType, half } from '../../domain/models/Field';
import { Colours, Furs, Metals } from '../../domain/models/Tinctures';
import { MissingTincture } from '../../domain/errors/parsing/MissingTincture';
import { UnknownDivision } from '../../domain/errors/parsing/UnknownDivision';
import { UnknownTincture } from '../../domain/errors/parsing/UnknownTincture';

const parser = new FrenchBlazonParser();
const writer = new FrenchBlazonWriter();

describe('divided fields', () => {
  test('reads "Parti d\'azur et d\'or" as a field divided per pale', () => {
    expect(parser.parse("Parti d'azur et d'or")).toEqual({
      field: { type: FieldType.pale, first: half(Colours.azure), second: half(Metals.or) },
    });
  });

  test.each([
    ['parti', FieldType.pale],
    ['coupé', FieldType.fess],
    ['tranché', FieldType.bend],
    ['taillé', FieldType.bendSinister],
  ])('%s divides the field per %s', (name, type) => {
    expect(parser.parse(`${name} de gueules et d'argent`)).toEqual({
      field: { type, first: half(Colours.gules), second: half(Metals.argent) },
    });
  });

  test('accepts tinctures named without their article', () => {
    expect(parser.parse('Parti azur et or')).toEqual({
      field: { type: FieldType.pale, first: half(Colours.azure), second: half(Metals.or) },
    });
  });

  test('accepts the same tincture on both sides', () => {
    expect(parser.parse("Coupé d'or et d'or")).toEqual({
      field: { type: FieldType.fess, first: half(Metals.or), second: half(Metals.or) },
    });
  });

  test('is case insensitive', () => {
    expect(parser.parse("TRANCHÉ D'AZUR ET DE SABLE")).toEqual({
      field: { type: FieldType.bend, first: half(Colours.azure), second: half(Colours.sable) },
    });
  });

  test('reads an accent that arrives decomposed', () => {
    const decomposed = "Coupé d'or et de sable".normalize('NFD');
    expect(decomposed).not.toBe("Coupé d'or et de sable");
    expect(parser.parse(decomposed)).toEqual({
      field: { type: FieldType.fess, first: half(Metals.or), second: half(Colours.sable) },
    });
  });

  test('closes with the optional full stop', () => {
    expect(parser.parse("Parti d'azur et d'or.")).toEqual({
      field: { type: FieldType.pale, first: half(Colours.azure), second: half(Metals.or) },
    });
  });

  describe('a half that bears something', () => {
    // The half at dexter is charged and the other is left the fur it named,
    // which is what the armorials write and what the model has held since a
    // half became arms of its own.
    test("reads \"Parti d'azur à trois fleurs de lys d'or et d'hermine\"", () => {
      expect(parser.parse("Parti d'azur à trois fleurs de lys d'or et d'hermine")).toEqual({
        field: {
          type: FieldType.pale,
          first: {
            field: { type: FieldType.plain, tincture: Colours.azure },
            chargesOrOrdinaries: [{ type: ChargeType.fleurDeLis, tincture: Metals.or, count: 3 }],
          },
          second: half(Furs.ermine),
        },
      });
    });

    test('reads a band on the first half as readily as a charge', () => {
      expect(parser.parse("Coupé d'or à la fasce de sable et d'azur")).toEqual({
        field: {
          type: FieldType.fess,
          first: {
            field: { type: FieldType.plain, tincture: Metals.or },
            chargesOrOrdinaries: [{ type: OrdinaryType.fess, tincture: Colours.sable }],
          },
          second: half(Colours.azure),
        },
      });
    });

    test('reads all the first half bears, in the order it was written', () => {
      expect(
        parser.parse("Parti d'azur à la fasce d'or, à trois billettes d'argent et de sable").field
      ).toMatchObject({
        first: {
          chargesOrOrdinaries: [
            { type: OrdinaryType.fess, tincture: Metals.or },
            { type: ChargeType.billet, tincture: Metals.argent, count: 3 },
          ],
        },
      });
    });

    // What follows the second half belongs to the shield, which is what an
    // armorial means by writing it there: a bordure written after the division
    // surrounds the whole shield rather than half of it.
    test('lays what follows the second half on the shield', () => {
      expect(parser.parse("Parti d'azur et d'or à la bordure de gueules")).toEqual({
        field: { type: FieldType.pale, first: half(Colours.azure), second: half(Metals.or) },
        chargesOrOrdinaries: [{ type: OrdinaryType.bordure, tincture: Colours.gules }],
      });
    });

    test('tells what the first half bears from what the shield bears', () => {
      expect(
        parser.parse("Parti d'azur à la fasce d'or et de gueules, à la bordure d'argent")
      ).toEqual({
        field: {
          type: FieldType.pale,
          first: {
            field: { type: FieldType.plain, tincture: Colours.azure },
            chargesOrOrdinaries: [{ type: OrdinaryType.fess, tincture: Metals.or }],
          },
          second: half(Colours.gules),
        },
        chargesOrOrdinaries: [{ type: OrdinaryType.bordure, tincture: Metals.argent }],
      });
    });

    test('survives the round trip, the charged half and all', () => {
      const blazon = "Parti d'azur à trois fleurs de lys d'or et d'hermine.";
      expect(writer.write(parser.parse(blazon))).toBe(blazon);
    });
  });

  describe('rejections', () => {
    test('rejects a division naming only one tincture', () => {
      expect(() => parser.parse("Parti d'azur")).toThrow();
    });

    test('reports a division whose tinctures never arrive as missing one', () => {
      expect(() => parser.parse('Coupé')).toThrow(MissingTincture);
    });

    test('rejects two tinctures without "et"', () => {
      expect(() => parser.parse("Parti d'azur d'or")).toThrow();
    });

    test('rejects an unknown division as a division it does not hold', () => {
      expect(() => parser.parse("Écartelé d'azur et d'or")).toThrow(UnknownDivision);
      expect(() => parser.parse("Écartelé d'azur et d'or")).toThrow(/Unknown division: écartelé/);
    });

    test('still reports an unknown tincture rather than an unknown division', () => {
      expect(() => parser.parse('de fuchsia')).toThrow(UnknownTincture);
      expect(() => parser.parse('de fuchsia')).toThrow(/Unknown tincture: fuchsia/);
    });

    // Which half was sown is a thing the model says and the writer writes, the
    // sowing belonging to the half's own field. The word for it is not read
    // inside a half yet, so the blazon is refused rather than half-read.
    test('does not yet read a sown half', () => {
      expect(() => parser.parse("Parti d'azur semé de billettes d'or et d'argent")).toThrow();
    });

    test('reports a division whose other half never arrives as missing a tincture', () => {
      // The first half read, charge and all, the other one is owed: the blazon
      // has named one tincture where a division names two.
      expect(() => parser.parse("Parti d'azur à la fasce d'or")).toThrow(MissingTincture);
      expect(() => parser.parse("Parti d'azur à la fasce d'or")).toThrow(
        /Missing tincture in: Parti d'azur à la fasce d'or/
      );
    });

    test('carries the elision rule into both halves', () => {
      expect(() => parser.parse("Parti d'azur et de or")).toThrow(UnknownTincture);
      expect(() => parser.parse("Parti d'azur et de or")).toThrow(/expected "d'or"/);
    });
  });
});
