import { describe, expect, test } from 'vitest';
import { FrenchBlazonParser } from '../parser/FrenchBlazonParser';
import { FieldType, half } from '../../domain/models/Field';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { MissingTincture } from '../../domain/errors/parsing/MissingTincture';
import { UnknownDivision } from '../../domain/errors/parsing/UnknownDivision';
import { UnknownTincture } from '../../domain/errors/parsing/UnknownTincture';

const parser = new FrenchBlazonParser();

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

    // A half is arms and the model holds one: "Parti d'azur à trois fleurs de
    // lys d'or et d'hermine" charges the half at dexter, and the writer writes
    // it. Reading it is a rule that has to know where the first half ends and
    // the conjunction begins, and until that rule is written the blazon is
    // refused outright rather than read by halves.
    test('does not yet read a half that bears a charge', () => {
      expect(() => parser.parse("Parti d'azur à trois fleurs de lys d'or et d'hermine")).toThrow(
        /Expected "et"/
      );
    });

    test('carries the elision rule into both halves', () => {
      expect(() => parser.parse("Parti d'azur et de or")).toThrow(UnknownTincture);
      expect(() => parser.parse("Parti d'azur et de or")).toThrow(/expected "d'or"/);
    });
  });
});
