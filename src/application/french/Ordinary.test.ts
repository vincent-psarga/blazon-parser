import { describe, expect, test } from 'vitest';
import { OrdinaryType } from '../../domain/models/Ordinary';
import { MissingTincture } from '../../domain/errors/parsing/MissingTincture';
import { UnknownOrdinary } from '../../domain/errors/parsing/UnknownOrdinary';
import { UnknownTincture } from '../../domain/errors/parsing/UnknownTincture';
import { Colours, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { wordOf } from '../../domain/translations/Translation';
import { FrenchOrdinaryType } from '../../domain/translations/fr/Ordinaries';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { FrenchBlazonParser } from '../parser/FrenchBlazonParser';
import { bearing, withArticle } from './FrenchGrammar';

const parser = new FrenchBlazonParser();

describe('a field bearing an ordinary', () => {
  test('reads "D\'azur à la fasce d\'or" as a fess on an azure field', () => {
    expect(parser.parse("D'azur à la fasce d'or")).toEqual({
      field: { tincture: Colours.azure },
      ordinary: { type: OrdinaryType.fess, tincture: Metals.or },
    });
  });

  test.each([
    ['au chef', OrdinaryType.chief],
    ['au pal', OrdinaryType.pale],
    ['à la fasce', OrdinaryType.fess],
    ['à la bande', OrdinaryType.bend],
    ['à la barre', OrdinaryType.bendSinister],
    ['au chevron', OrdinaryType.chevron],
    ['à la croix', OrdinaryType.cross],
    ['au sautoir', OrdinaryType.saltire],
  ])('reads "%s" as that ordinary', (borne, type) => {
    expect(parser.parse(`De gueules ${borne} d'argent`)).toEqual({
      field: { tincture: Colours.gules },
      ordinary: { type, tincture: Metals.argent },
    });
  });

  test.each(TINCTURES)('gives the ordinary a tincture of its own: %s', (tincture) => {
    const blazon = parser.parse(
      `D'azur au chevron ${withArticle(wordOf(FrenchTinctures, tincture))}`
    );
    expect(blazon.ordinary).toEqual({ type: OrdinaryType.chevron, tincture });
  });

  test('lays an ordinary on a divided field as readily as on a plain one', () => {
    expect(parser.parse("Parti d'azur et d'or au sautoir de gueules").ordinary).toEqual({
      type: OrdinaryType.saltire,
      tincture: Colours.gules,
    });
  });

  test('accepts the same tincture on the field and on what it bears', () => {
    expect(parser.parse("D'or à la fasce d'or").ordinary).toEqual({
      type: OrdinaryType.fess,
      tincture: Metals.or,
    });
  });

  test('is case insensitive', () => {
    expect(parser.parse("D'AZUR AU CHEVRON D'OR")).toEqual(parser.parse("d'azur au chevron d'or"));
  });

  test('closes with the optional full stop', () => {
    expect(parser.parse("D'azur au chevron d'or.")).toEqual(parser.parse("D'azur au chevron d'or"));
  });

  test('leaves the key off entirely when the field bears nothing', () => {
    expect(parser.parse("D'azur")).not.toHaveProperty('ordinary');
  });

  describe('the article agreeing with the ordinary it introduces', () => {
    test.each([
      [OrdinaryType.chief, 'au chef'],
      [OrdinaryType.pale, 'au pal'],
      [OrdinaryType.fess, 'à la fasce'],
      [OrdinaryType.bend, 'à la bande'],
      [OrdinaryType.bendSinister, 'à la barre'],
      [OrdinaryType.chevron, 'au chevron'],
      [OrdinaryType.cross, 'à la croix'],
      [OrdinaryType.saltire, 'au sautoir'],
    ])('bears %s as "%s"', (type, expected) => {
      expect(bearing(wordOf(FrenchOrdinaryType, type))).toBe(expected);
    });

    test('names every ordinary with an article the parser then accepts', () => {
      for (const type of Object.values(OrdinaryType)) {
        const borne = bearing(wordOf(FrenchOrdinaryType, type));
        expect(parser.parse(`D'azur ${borne} d'or`).ordinary).toEqual({
          type,
          tincture: Metals.or,
        });
      }
    });
  });

  describe('rejections', () => {
    test.each(['fasce', 'bande', 'barre', 'croix'])(
      'rejects the feminine %s taking "au"',
      (word) => {
        expect(() => parser.parse(`D'azur au ${word} d'or`)).toThrow(UnknownOrdinary);
        expect(() => parser.parse(`D'azur au ${word} d'or`)).toThrow(
          new RegExp(`expected "à la ${word}"`)
        );
      }
    );

    test.each(['chef', 'pal', 'chevron', 'sautoir'])(
      'rejects the masculine %s taking "à la"',
      (word) => {
        expect(() => parser.parse(`D'azur à la ${word} d'or`)).toThrow(
          new RegExp(`expected "au ${word}"`)
        );
      }
    );

    test('rejects an ordinary the vocabulary does not know', () => {
      expect(() => parser.parse("D'azur à la bordure d'or")).toThrow(UnknownOrdinary);
      expect(() => parser.parse("D'azur à la bordure d'or")).toThrow(/Unknown ordinary: bordure/);
    });

    test('tells the bande apart from the tranché it runs along', () => {
      expect(parser.parse("D'azur à la bande d'or").ordinary).toMatchObject({
        type: OrdinaryType.bend,
      });
      expect(parser.parse("Tranché d'azur et d'or")).not.toHaveProperty('ordinary');
    });

    test('tells the barre apart from the taillé it runs along', () => {
      expect(parser.parse("D'azur à la barre d'or").ordinary).toMatchObject({
        type: OrdinaryType.bendSinister,
      });
      expect(parser.parse("Taillé d'azur et d'or")).not.toHaveProperty('ordinary');
    });

    test('rejects an ordinary named without its article', () => {
      expect(() => parser.parse("D'azur fasce d'or")).toThrow();
    });

    test('rejects an ordinary with no tincture of its own, as a missing tincture', () => {
      expect(() => parser.parse("D'azur à la fasce")).toThrow(MissingTincture);
    });

    test('rejects a second ordinary: a field bears one at most', () => {
      expect(() => parser.parse("D'azur à la fasce d'or au chevron de gueules")).toThrow();
    });

    test("carries the elision rule into the ordinary's tincture", () => {
      expect(() => parser.parse("D'azur à la fasce de or")).toThrow(UnknownTincture);
      expect(() => parser.parse("D'azur à la fasce de or")).toThrow(/expected "d'or"/);
    });
  });
});
