import { describe, expect, test } from 'vitest';
import { FrenchBlazonParser } from '../parser/FrenchBlazonParser';
import { FrenchBlazonWriter } from '../writer/FrenchBlazonWriter';
import { ChargeType } from '../../domain/models/Charge';
import { Modifier } from '../../domain/models/Modifier';
import { OrdinaryType } from '../../domain/models/Ordinary';
import { FieldType, half } from '../../domain/models/Field';
import { Colours, Furs, Metals } from '../../domain/models/Tinctures';
import { ChargedPlainField } from '../../domain/errors/parsing/ChargedPlainField';
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

  describe('a half that says more than its tincture', () => {
    // A half is a field, so it takes whatever the tongue says of a field of one
    // tincture: that it is plain, or what it is sown with. This entry is
    // transcribed from the armorial of the Round Table, and says both at once —
    // the half at dexter charged with six mascles, the other called plain to say
    // it carries nothing.
    test('reads a half called plain beside a charged one', () => {
      expect(parser.parse("Parti d'azur à six macles d'argent, et d'hermine plain")).toEqual({
        field: {
          type: FieldType.pale,
          first: {
            field: { type: FieldType.plain, tincture: Colours.azure },
            chargesOrOrdinaries: [
              {
                type: ChargeType.lozenge,
                tincture: Metals.argent,
                count: 6,
                modifier: Modifier.voided,
              },
            ],
          },
          second: half(Furs.ermine),
        },
      });
    });

    // The word promises what it always promises, and it promises it of the half
    // it was said of: the half that bears something after being called plain is
    // refused, and the other half is no business of the word's.
    test('holds a half called plain to bearing nothing', () => {
      expect(parser.parse('Parti de vair plain, et de gueules').field).toEqual({
        type: FieldType.pale,
        first: half(Furs.vair),
        second: half(Colours.gules),
      });
      expect(() => parser.parse("Parti de vair plain à la fasce d'or, et de gueules")).toThrow(
        ChargedPlainField
      );
    });

    // Which the armorials write before the conjunction as readily as not: it
    // says no more than the conjunction does, so it is read and dropped, exactly
    // as the mark between two charges is.
    test('reads the mark a blazon sets before the conjunction, and writes none', () => {
      const marked = parser.parse("Parti d'azur à la fasce d'or, et de gueules");
      expect(marked).toEqual(parser.parse("Parti d'azur à la fasce d'or et de gueules"));
      expect(writer.write(marked)).toBe("Parti d'azur à la fasce d'or et de gueules.");
    });

    test('sows each half with its own, as the armorials write it', () => {
      expect(
        parser.parse(
          "Parti de gueules semé de billettes d'argent, et de sinople semé de billettes d'or"
        ).field
      ).toMatchObject({
        first: { field: { semy: { type: ChargeType.billet, tincture: Metals.argent } } },
        second: { field: { semy: { type: ChargeType.billet, tincture: Metals.or } } },
      });
    });
  });

  describe('the ranked form, which the handbooks prescribe', () => {
    const LILIES = {
      type: FieldType.pale,
      first: {
        field: { type: FieldType.plain, tincture: Colours.azure },
        chargesOrOrdinaries: [{ type: ChargeType.fleurDeLis, tincture: Metals.or, count: 3 }],
      },
      second: half(Furs.ermine),
    };

    // The same arms either way: the rank says which part the arms after it are
    // laid in, where the unranked form says it by where the phrase stands. So
    // the two forms are two ways of writing one blazon, and the model holds no
    // trace of which was written.
    test('reads the ranked form as the same arms the unranked form gives', () => {
      expect(
        parser.parse("Parti, au premier d'azur à trois fleurs de lys d'or, au second d'hermine")
          .field
      ).toEqual(LILIES);
      expect(parser.parse("Parti d'azur à trois fleurs de lys d'or et d'hermine").field).toEqual(
        LILIES
      );
    });

    // The armorials write the rank three ways, and the armorial of the
    // Plantagenets writes it in Roman numerals.
    test.each([
      ['in words', "Parti, au premier d'azur, au second de gueules"],
      ['the second part the longer way', "Parti, au premier d'azur, au deuxième de gueules"],
      ['in figures', "Parti, au 1 d'azur, au 2 de gueules"],
      ['in Roman numerals', "Parti, au I d'azur, au II de gueules"],
    ])('reads the rank written %s', (_how, blazon) => {
      expect(parser.parse(blazon).field).toEqual({
        type: FieldType.pale,
        first: half(Colours.azure),
        second: half(Colours.gules),
      });
    });

    // Whatever the tongue sets between the parts is read and dropped: the mark,
    // the conjunction, or both — "mi-parti : au premier d'or [...], et au second
    // de gueules [...]" writes all of them.
    test.each([
      "Parti, au premier d'or, au second de gueules",
      "Parti : au premier d'or, et au second de gueules",
      "Parti au premier d'or au second de gueules",
      "Parti ; au premier d'or ; et au second de gueules",
    ])('reads the marks a blazon sets between the parts: %s', (blazon) => {
      expect(parser.parse(blazon).field).toEqual({
        type: FieldType.pale,
        first: half(Metals.or),
        second: half(Colours.gules),
      });
    });

    // Which is what the ranked form is for: the unranked one can charge the
    // first part alone, everything after the second part belonging to the shield.
    test('charges the second part, which the unranked form cannot', () => {
      expect(
        parser.parse("Parti, au premier de vair plain, au second de gueules à la bordure d'or")
      ).toEqual({
        field: {
          type: FieldType.pale,
          first: half(Furs.vair),
          second: {
            field: { type: FieldType.plain, tincture: Colours.gules },
            chargesOrOrdinaries: [{ type: OrdinaryType.bordure, tincture: Metals.or }],
          },
        },
      });
    });

    test('writes the ranked form only where the unranked one could not say it', () => {
      const charged = "Parti, au premier de vair, au second de gueules à la bordure d'or.";
      expect(writer.write(parser.parse(charged))).toBe(charged);
      // The first part charged and the other bare: the armorials write that
      // unranked, so the rank is dropped and the arms are the same arms.
      expect(
        writer.write(
          parser.parse("Parti, au premier d'azur à trois fleurs de lys d'or, au second d'hermine")
        )
      ).toBe("Parti d'azur à trois fleurs de lys d'or et d'hermine.");
    });

    test('names the parts in the order the partition takes them, or is refused', () => {
      expect(() => parser.parse("Parti, au second d'or, au premier de gueules")).toThrow(
        /names its parts in the order the partition takes them/
      );
      expect(() => parser.parse("Parti, au premier d'or, au premier de gueules")).toThrow();
    });

    test('reports a ranked division whose other part never arrives', () => {
      expect(() => parser.parse("Parti, au premier d'azur")).toThrow(
        /Missing the other part in: Parti, au premier d'azur/
      );
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
