import { describe, expect, test } from 'vitest';
import { MissingTincture } from '../../domain/errors/parsing/MissingTincture';
import { UnknownOrdinary } from '../../domain/errors/parsing/UnknownOrdinary';
import { WrongOrdinaryArticle } from '../../domain/errors/parsing/WrongOrdinaryArticle';
import { ChargeType } from '../../domain/models/Charge';
import { OrdinaryType } from '../../domain/models/Ordinary';
import { Colours, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { wordOf } from '../../domain/translations/Translation';
import { FrenchChargeType } from '../../domain/translations/fr/Charges';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { FrenchBlazonParser } from '../parser/FrenchBlazonParser';
import { bearing, everyBearing, withArticle } from './FrenchGrammar';

const parser = new FrenchBlazonParser();
const CHARGES = Object.values(ChargeType);

describe('a field bearing a charge', () => {
  test('reads "D\'azur à la billette d\'or" as a billet on an azure field', () => {
    expect(parser.parse("D'azur à la billette d'or")).toEqual({
      field: { tincture: Colours.azure },
      chargesOrOrdinaries: [{ type: ChargeType.billet, tincture: Metals.or }],
    });
  });

  test.each([
    ["à l'annelet", ChargeType.annulet],
    ['à la billette', ChargeType.billet],
    ['à la losange', ChargeType.lozenge],
  ])('reads "%s" as that charge', (borne, type) => {
    expect(parser.parse(`De gueules ${borne} d'argent`)).toEqual({
      field: { tincture: Colours.gules },
      chargesOrOrdinaries: [{ type, tincture: Metals.argent }],
    });
  });

  test.each(TINCTURES)('gives the charge a tincture of its own: %s', (tincture) => {
    const blazon = parser.parse(
      `D'azur au losange ${withArticle(wordOf(FrenchTinctures, tincture))}`
    );
    expect(blazon.chargesOrOrdinaries).toEqual([{ type: ChargeType.lozenge, tincture }]);
  });

  test('lays a charge on a divided field as readily as on a plain one', () => {
    expect(
      parser.parse("Parti d'azur et d'or à la billette de gueules").chargesOrOrdinaries
    ).toEqual([{ type: ChargeType.billet, tincture: Colours.gules }]);
  });

  test('is case insensitive, and closes with the optional full stop', () => {
    expect(parser.parse("D'AZUR AU LOSANGE D'OR.")).toEqual(parser.parse("d'azur au losange d'or"));
  });

  test('holds the charge in the list a band is held in, there being one list', () => {
    expect(parser.parse("D'azur à la fasce d'or").chargesOrOrdinaries).toEqual([
      { type: OrdinaryType.fess, tincture: Metals.or },
    ]);
    expect(parser.parse("D'azur à la billette d'or").chargesOrOrdinaries).toEqual([
      { type: ChargeType.billet, tincture: Metals.or },
    ]);
  });

  test('leaves the key off entirely when the field bears nothing at all', () => {
    expect(parser.parse("D'azur")).not.toHaveProperty('chargesOrOrdinaries');
  });

  describe('the article agreeing with the charge it introduces', () => {
    test.each([
      [ChargeType.annulet, "à l'annelet"],
      [ChargeType.billet, 'à la billette'],
      [ChargeType.lozenge, 'à la losange'],
    ])('bears %s as "%s"', (type, expected) => {
      expect(bearing(wordOf(FrenchChargeType, type))).toBe(expected);
    });

    test('names every charge with an article the parser then accepts', () => {
      for (const type of CHARGES) {
        const borne = bearing(wordOf(FrenchChargeType, type));
        expect(parser.parse(`D'azur ${borne} d'or`).chargesOrOrdinaries).toEqual([
          { type, tincture: Metals.or },
        ]);
      }
    });

    test('refuses the feminine billette taking "au"', () => {
      expect(() => parser.parse("D'azur au billette d'or")).toThrow(WrongOrdinaryArticle);
      expect(() => parser.parse("D'azur au billette d'or")).toThrow(/expected "à la billette"/);
    });

    test('reads the losange under either gender, the armorials being written both ways', () => {
      expect(parser.parse("D'azur au losange d'or")).toEqual(
        parser.parse("D'azur à la losange d'or")
      );
    });

    test('writes the losange back out feminine, whichever gender it was read under', () => {
      expect(bearing(wordOf(FrenchChargeType, ChargeType.lozenge))).toBe('à la losange');
      expect(everyBearing(wordOf(FrenchChargeType, ChargeType.lozenge))).toEqual([
        'à la losange',
        'au losange',
      ]);
    });

    test('holds every other charge to the one gender it declares', () => {
      expect(everyBearing(wordOf(FrenchChargeType, ChargeType.billet))).toEqual(['à la billette']);
      expect(() => parser.parse("D'azur au billette d'or")).toThrow(WrongOrdinaryArticle);
    });

    test('refuses the elided annelet taking either unelided article', () => {
      expect(() => parser.parse("D'azur au annelet d'or")).toThrow(WrongOrdinaryArticle);
      expect(() => parser.parse("D'azur à la annelet d'or")).toThrow(WrongOrdinaryArticle);
      expect(() => parser.parse("D'azur au annelet d'or")).toThrow(/expected "à l'annelet"/);
    });

    test('refuses an elided article before a word that does not elide', () => {
      expect(() => parser.parse("D'azur à l'losange d'or")).toThrow(WrongOrdinaryArticle);
    });

    test('reads the typographic apostrophe as readily as the typed one', () => {
      expect(parser.parse("D'azur à l’annelet d'or")).toEqual(
        parser.parse("D'azur à l'annelet d'or")
      );
    });
  });

  test('still owes the charge a tincture of its own', () => {
    expect(() => parser.parse("D'azur à la billette")).toThrow(MissingTincture);
  });
});

describe('a field bearing several of one charge', () => {
  test('reads "D\'argent à trois billettes d\'or" as three billets', () => {
    expect(parser.parse("D'argent à trois billettes d'or")).toEqual({
      field: { tincture: Metals.argent },
      chargesOrOrdinaries: [{ type: ChargeType.billet, tincture: Metals.or, count: 3 }],
    });
  });

  test.each([
    ['deux annelets', ChargeType.annulet, 2],
    ['trois billettes', ChargeType.billet, 3],
    ['six losanges', ChargeType.lozenge, 6],
    ['seize annelets', ChargeType.annulet, 16],
  ])('reads "%s" as that many of that charge', (borne, type, count) => {
    expect(parser.parse(`D'azur à ${borne} d'or`).chargesOrOrdinaries).toEqual([
      { type, tincture: Metals.or, count },
    ]);
  });

  test('bears every charge in number, none of them being a place on the shield', () => {
    for (const type of CHARGES) {
      const word = wordOf(FrenchChargeType, type);
      expect(parser.parse(`D'azur à trois ${word.plural} d'or`).chargesOrOrdinaries).toEqual([
        { type, tincture: Metals.or, count: 3 },
      ]);
    }
  });

  test('reads the count in figures as readily as in words', () => {
    expect(parser.parse("D'argent à 3 billettes d'or")).toEqual(
      parser.parse("D'argent à trois billettes d'or")
    );
  });

  test('leaves the count off when a single charge is borne', () => {
    expect(parser.parse("D'azur au losange d'or").chargesOrOrdinaries?.[0]).not.toHaveProperty(
      'count'
    );
  });

  test('refuses a count of one, a single charge being named on its own', () => {
    expect(() => parser.parse("D'azur à 1 losanges d'or")).toThrow(/not more than one/);
  });

  test('refuses the singular name after a count', () => {
    expect(() => parser.parse("D'azur à trois losange d'or")).toThrow(UnknownOrdinary);
  });
});

describe('a field bearing bands and charges together', () => {
  test('reads both into one list, in the order the blazon laid them', () => {
    expect(parser.parse("D'or à la fasce de gueules, à trois billettes d'azur")).toEqual({
      field: { tincture: Metals.or },
      chargesOrOrdinaries: [
        { type: OrdinaryType.fess, tincture: Colours.gules },
        { type: ChargeType.billet, tincture: Colours.azure, count: 3 },
      ],
    });
  });

  test('keeps that order, which says which covers which', () => {
    const over = parser.parse("D'or à la billette d'azur ; à la bande de gueules");
    const under = parser.parse("D'or à la bande de gueules ; à la billette d'azur");
    expect(over.chargesOrOrdinaries?.map(({ type }) => type)).toEqual([
      ChargeType.billet,
      OrdinaryType.bend,
    ]);
    expect(under.chargesOrOrdinaries?.map(({ type }) => type)).toEqual([
      OrdinaryType.bend,
      ChargeType.billet,
    ]);
  });

  test('reads several kinds of charge at once', () => {
    expect(
      parser.parse("D'or à la billette d'azur, au losange de gueules").chargesOrOrdinaries
    ).toEqual([
      { type: ChargeType.billet, tincture: Colours.azure },
      { type: ChargeType.lozenge, tincture: Colours.gules },
    ]);
  });

  test('reads them with no mark between, the article saying it alone', () => {
    expect(parser.parse("D'or à la fasce de gueules à la billette d'azur")).toEqual(
      parser.parse("D'or à la fasce de gueules, à la billette d'azur")
    );
  });
});
