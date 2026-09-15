import { describe, expect, test } from 'vitest';
import { MissingPieces } from '../../domain/errors/parsing/MissingPieces';
import { MissingTincture } from '../../domain/errors/parsing/MissingTincture';
import { UnknownDivision } from '../../domain/errors/parsing/UnknownDivision';
import { DivisionType, VariationType } from '../../domain/models/Field';
import { OrdinaryType } from '../../domain/models/Ordinary';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { FrenchBlazonParser } from '../parser/FrenchBlazonParser';

const parser = new FrenchBlazonParser();

describe('varied fields', () => {
  test('reads "Fascé d\'argent et de gueules" as a field cut in the six pieces understood', () => {
    expect(parser.parse("Fascé d'argent et de gueules")).toEqual({
      field: {
        type: VariationType.barry,
        firstTincture: Metals.argent,
        secondTincture: Colours.gules,
        pieces: 6,
      },
    });
  });

  test.each([
    ['fascé', VariationType.barry],
    ['palé', VariationType.paly],
    ['bandé', VariationType.bendy],
    ['chevronné', VariationType.chevronny],
  ])('reads "%s" as that varied field', (name, type) => {
    expect(parser.parse(`${name} d'or et d'azur`).field).toEqual({
      type,
      firstTincture: Metals.or,
      secondTincture: Colours.azure,
      pieces: 6,
    });
  });

  test('gives the first tincture named the first piece', () => {
    const arms = parser.parse("Fascé de gueules et d'argent").field;
    expect(arms).toMatchObject({ firstTincture: Colours.gules, secondTincture: Metals.argent });
  });

  test('is case insensitive, and closes with the optional full stop', () => {
    expect(parser.parse("FASCÉ D'ARGENT ET DE GUEULES.")).toEqual(
      parser.parse("fascé d'argent et de gueules")
    );
  });

  describe('how many pieces', () => {
    test('reads the count an armorial writes after the tinctures', () => {
      expect(parser.parse("Bandé de gueules et d'argent de six pièces.").field).toEqual({
        type: VariationType.bendy,
        firstTincture: Colours.gules,
        secondTincture: Metals.argent,
        pieces: 6,
      });
    });

    test('reads "en six pièces", which armorials write as readily', () => {
      expect(parser.parse("Bandé d'or et d'azur en six pièces")).toEqual(
        parser.parse("Bandé d'or et d'azur de six pièces")
      );
    });

    test('reads a count that is not the one understood', () => {
      expect(parser.parse("Palé d'argent et de gueules de huit pièces").field).toMatchObject({
        type: VariationType.paly,
        pieces: 8,
      });
    });

    test('reads the count in figures as readily as in words', () => {
      expect(parser.parse("Fascé d'argent et de gueules de 10 pièces")).toEqual(
        parser.parse("Fascé d'argent et de gueules de dix pièces")
      );
    });

    test('takes the count as written where it is the one understood anyway', () => {
      expect(parser.parse("Fascé d'argent et de gueules de six pièces")).toEqual(
        parser.parse("Fascé d'argent et de gueules")
      );
    });
  });

  describe('the émanché, which no number is understood of', () => {
    test('reads the count it is always written with', () => {
      expect(parser.parse("Émanché d'argent et de gueules de sept pièces").field).toEqual({
        type: VariationType.pily,
        firstTincture: Metals.argent,
        secondTincture: Colours.gules,
        pieces: 7,
      });
    });

    test('is counted odd as readily as even, its piles interlocking', () => {
      expect(parser.parse("Émanché d'or et d'azur de cinq pièces").field).toMatchObject({
        pieces: 5,
      });
    });

    test('is refused where the blazon never counted it', () => {
      expect(() => parser.parse("Émanché d'argent et de gueules")).toThrow(MissingPieces);
      expect(() => parser.parse("Émanché d'argent et de gueules")).toThrow(
        /émanché must say how many/
      );
    });
  });

  describe('rejections', () => {
    test('refuses an odd number of pieces, the tinctures having to alternate', () => {
      expect(() => parser.parse("Fascé d'argent et de gueules de cinq pièces")).toThrow(
        /so its pieces are even: 5 is odd/
      );
    });

    test('refuses a field cut into one piece, which is no cutting at all', () => {
      expect(() => parser.parse("Fascé d'argent et de gueules de 1 pièces")).toThrow(
        /not more than one/
      );
    });

    test('refuses a varied field the vocabulary does not know', () => {
      expect(() => parser.parse("Fuselé d'argent et de gueules")).toThrow(UnknownDivision);
      expect(() => parser.parse("Fuselé d'argent et de gueules")).toThrow(
        /Unknown division: fuselé/
      );
    });

    test('still owes both its tinctures', () => {
      expect(() => parser.parse("Fascé d'argent et")).toThrow(MissingTincture);
      expect(() => parser.parse('Fascé')).toThrow(MissingTincture);
    });

    test('refuses a count with nothing counted', () => {
      expect(() => parser.parse("Fascé d'argent et de gueules de pièces")).toThrow();
    });

    test('tells the fascé apart from the coupé it repeats', () => {
      expect(parser.parse("Fascé d'argent et de gueules").field).toMatchObject({
        type: VariationType.barry,
      });
      expect(parser.parse("Coupé d'argent et de gueules").field).toMatchObject({
        type: DivisionType.fess,
      });
    });

    test('tells the bandé apart from the tranché it repeats', () => {
      expect(parser.parse("Bandé d'argent et de gueules").field).toMatchObject({
        type: VariationType.bendy,
      });
      expect(parser.parse("Tranché d'argent et de gueules").field).toMatchObject({
        type: DivisionType.bend,
      });
    });
  });

  describe('what a varied field bears', () => {
    test('bears an ordinary as any other field does', () => {
      expect(parser.parse("Bandé d'or et d'azur en six pièces, à la bordure de gueules")).toEqual({
        field: {
          type: VariationType.bendy,
          firstTincture: Metals.or,
          secondTincture: Colours.azure,
          pieces: 6,
        },
        ordinaries: [{ type: OrdinaryType.bordure, tincture: Colours.gules }],
      });
    });

    test('tells the count of its pieces from the count of what it bears', () => {
      const arms = parser.parse("Fascé d'or et d'azur de huit pièces à trois chevrons de gueules");
      expect(arms.field).toMatchObject({ pieces: 8 });
      expect(arms.ordinaries).toMatchObject([{ count: 3 }]);
    });
  });
});
