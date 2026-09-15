import { describe, expect, test } from 'vitest';
import { Blazon } from '../../domain/models/Blazon';
import { DivisionType, VariationType } from '../../domain/models/Field';
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
          ordinaries: [{ type: OrdinaryType.fess, tincture: Metals.or }],
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
          ordinaries: [{ type, tincture: Metals.argent }],
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
          ordinaries: [{ type: OrdinaryType.saltire, tincture: Colours.gules }],
        })
      ).toBe("Parti d'azur et d'or au sautoir de gueules.");
    });

    test('closes the sentence after what the field bears, not before', () => {
      const written = writer.write({
        field: { tincture: Colours.vert },
        ordinaries: [{ type: OrdinaryType.chevron, tincture: Metals.or }],
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
        ordinaries: [{ type: OrdinaryType.bend, tincture: Metals.or }],
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

describe('several of one ordinary', () => {
  test('writes the count in words after the bare preposition', () => {
    // Blazonry keeps "à" where ordinary French would contract it into "aux".
    expect(
      writer.write({
        field: { tincture: Colours.gules },
        ordinaries: [{ type: OrdinaryType.chevron, tincture: Metals.or, count: 3 }],
      })
    ).toBe("De gueules à trois chevrons d'or.");
  });

  test.each([
    [OrdinaryType.pale, 2, "D'azur à deux pals d'or."],
    [OrdinaryType.fess, 3, "D'azur à trois fasces d'or."],
    [OrdinaryType.bend, 6, "D'azur à six bandes d'or."],
    [OrdinaryType.bendSinister, 4, "D'azur à quatre barres d'or."],
  ])('writes %s borne %i times as "%s"', (type, count, expected) => {
    expect(
      writer.write({
        field: { tincture: Colours.azure },
        ordinaries: [{ type, tincture: Metals.or, count }],
      })
    ).toBe(expected);
  });

  test('writes a single band as the one it is, count or no count', () => {
    expect(
      writer.write({
        field: { tincture: Colours.azure },
        ordinaries: [{ type: OrdinaryType.chevron, tincture: Metals.or, count: 1 }],
      })
    ).toBe("D'azur au chevron d'or.");
  });

  test('writes but one of an ordinary borne but once, whatever it was handed', () => {
    expect(
      writer.write({
        field: { tincture: Colours.azure },
        ordinaries: [{ type: OrdinaryType.chief, tincture: Metals.or, count: 3 }],
      })
    ).toBe("D'azur au chef d'or.");
  });

  test('survives the round trip, count and all', () => {
    const blazon: Blazon = {
      field: { tincture: Metals.or },
      ordinaries: [{ type: OrdinaryType.fess, tincture: Colours.sable, count: 3 }],
    };
    expect(parser.parse(writer.write(blazon))).toEqual(blazon);
  });

  test.each(["D'argent à 3 bandes de gueules", "D'argent aux trois bandes de gueules"])(
    'normalises %s into the form a blazon is written in',
    (text) => {
      expect(writer.write(parser.parse(text))).toBe("D'argent à trois bandes de gueules.");
    }
  );

  test('falls back on the figure where the language has no word for the number', () => {
    // Seventeen is written with a hyphen, which the lexer does not read, so it
    // is not in the vocabulary. A figure is a poor blazon but an honest one.
    expect(
      writer.write({
        field: { tincture: Metals.or },
        ordinaries: [{ type: OrdinaryType.fess, tincture: Colours.gules, count: 17 }],
      })
    ).toBe("D'or à 17 fasces de gueules.");
  });
});

describe('a field bearing more than one ordinary', () => {
  const ARMS: Blazon = {
    field: { tincture: Metals.or },
    ordinaries: [
      { type: OrdinaryType.bend, tincture: Colours.sable, count: 3 },
      { type: OrdinaryType.bordure, tincture: Colours.gules },
    ],
  };

  test('writes them one after the other, a comma between', () => {
    expect(writer.write(ARMS)).toBe("D'or à trois bandes de sable, à la bordure de gueules.");
  });

  test('writes them in the order they are laid, which says which covers which', () => {
    expect(writer.write({ ...ARMS, ordinaries: [...ARMS.ordinaries!].reverse() })).toBe(
      "D'or à la bordure de gueules, à trois bandes de sable."
    );
  });

  test('sets nothing but a space between the field and the first of them', () => {
    expect(writer.write(ARMS)).toContain("D'or à trois");
  });

  test('survives the round trip, the order and all', () => {
    expect(parser.parse(writer.write(ARMS))).toEqual(ARMS);
  });

  test('writes the semicolon an armorial set as the comma it means', () => {
    expect(
      writer.write(parser.parse("D'or à trois bandes de sable ; à la bordure de gueules"))
    ).toBe("D'or à trois bandes de sable, à la bordure de gueules.");
  });

  test('gives each one its own article, agreed with its own name', () => {
    expect(
      writer.write({
        field: { tincture: Metals.argent },
        ordinaries: [
          { type: OrdinaryType.chevron, tincture: Metals.or },
          { type: OrdinaryType.fess, tincture: Colours.gules },
        ],
      })
    ).toBe("D'argent au chevron d'or, à la fasce de gueules.");
  });
});

describe('the bordure', () => {
  test('is borne under the feminine article', () => {
    expect(
      writer.write({
        field: { tincture: Metals.argent },
        ordinaries: [{ type: OrdinaryType.bordure, tincture: Colours.gules }],
      })
    ).toBe("D'argent à la bordure de gueules.");
  });
});

describe('a varied field', () => {
  const barry = (pieces: number): Blazon => ({
    field: {
      type: VariationType.barry,
      firstTincture: Metals.argent,
      secondTincture: Colours.gules,
      pieces,
    },
  });

  test('keeps quiet about the number the term is understood to have', () => {
    // "Le bandé est normalement divisé en six pièces, qu'on ne blasonne pas."
    expect(writer.write(barry(6))).toBe("Fascé d'argent et de gueules.");
  });

  test('counts the pieces after the tinctures where they are not the six understood', () => {
    expect(writer.write(barry(8))).toBe("Fascé d'argent et de gueules de huit pièces.");
  });

  test.each([
    [VariationType.barry, 'Fascé'],
    [VariationType.paly, 'Palé'],
    [VariationType.bendy, 'Bandé'],
    [VariationType.chevronny, 'Chevronné'],
  ])('names %s in French', (type, name) => {
    expect(writer.write({ ...barry(6), field: { ...barry(6).field, type } as never })).toBe(
      `${name} d'argent et de gueules.`
    );
  });

  test('counts the émanché always, no number being understood of it', () => {
    expect(
      writer.write({
        field: {
          type: VariationType.pily,
          firstTincture: Metals.or,
          secondTincture: Colours.azure,
          pieces: 6,
        },
      })
    ).toBe("Émanché d'or et d'azur de six pièces.");
  });

  test('survives the round trip, counted or not', () => {
    for (const pieces of [4, 6, 8, 12]) {
      expect(parser.parse(writer.write(barry(pieces)))).toEqual(barry(pieces));
    }
  });

  test('normalises the count an armorial wrote where the term says it anyway', () => {
    expect(writer.write(parser.parse("Bandé de gueules et d'argent de six pièces."))).toBe(
      "Bandé de gueules et d'argent."
    );
  });

  test('writes what it bears after the pieces it is cut into', () => {
    expect(
      writer.write(parser.parse("Bandé d'or et d'azur de huit pièces à la bordure de gueules"))
    ).toBe("Bandé d'or et d'azur de huit pièces à la bordure de gueules.");
  });

  test('falls back on the figure where French has no word for the number', () => {
    expect(writer.write(barry(20))).toBe("Fascé d'argent et de gueules de 20 pièces.");
  });
});
