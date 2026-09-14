import { describe, expect, test } from 'vitest';
import { FrenchBlazonParser } from '../parser/FrenchBlazonParser';
import { DivisionType } from '../../domain/models/Field';
import { Colours, Metals } from '../../domain/models/Tinctures';

const parser = new FrenchBlazonParser();

describe('divided fields', () => {
  test('reads "Parti d\'azur et d\'or" as a field divided per pale', () => {
    expect(parser.parse("Parti d'azur et d'or")).toEqual({
      field: {
        type: DivisionType.pale,
        firstTincture: Colours.azure,
        secondTincture: Metals.gold,
      },
    });
  });

  test.each([
    ['parti', DivisionType.pale],
    ['coupé', DivisionType.fess],
    ['tranché', DivisionType.bend],
    ['taillé', DivisionType.bendSinister],
  ])('%s divides the field per %s', (name, type) => {
    expect(parser.parse(`${name} de gueules et d'argent`)).toEqual({
      field: { type, firstTincture: Colours.gules, secondTincture: Metals.silver },
    });
  });

  test('accepts tinctures named without their article', () => {
    expect(parser.parse('Parti azur et or')).toEqual({
      field: { type: DivisionType.pale, firstTincture: Colours.azure, secondTincture: Metals.gold },
    });
  });

  test('accepts the same tincture on both sides', () => {
    expect(parser.parse("Coupé d'or et d'or")).toEqual({
      field: { type: DivisionType.fess, firstTincture: Metals.gold, secondTincture: Metals.gold },
    });
  });

  test('is case insensitive', () => {
    expect(parser.parse("TRANCHÉ D'AZUR ET DE SABLE")).toEqual({
      field: { type: DivisionType.bend, firstTincture: Colours.azure, secondTincture: Colours.sable },
    });
  });

  test('reads an accent that arrives decomposed', () => {
    const decomposed = "Coupé d'or et de sable".normalize('NFD');
    expect(decomposed).not.toBe("Coupé d'or et de sable");
    expect(parser.parse(decomposed)).toEqual({
      field: { type: DivisionType.fess, firstTincture: Metals.gold, secondTincture: Colours.sable },
    });
  });

  test('closes with the optional full stop', () => {
    expect(parser.parse("Parti d'azur et d'or.")).toEqual({
      field: { type: DivisionType.pale, firstTincture: Colours.azure, secondTincture: Metals.gold },
    });
  });

  describe('rejections', () => {
    test('rejects a division naming only one tincture', () => {
      expect(() => parser.parse("Parti d'azur")).toThrow();
    });

    test('rejects two tinctures without "et"', () => {
      expect(() => parser.parse("Parti d'azur d'or")).toThrow();
    });

    test('rejects an unknown division', () => {
      expect(() => parser.parse("Écartelé d'azur et d'or")).toThrow();
    });

    test('still reports an unknown tincture rather than an unknown division', () => {
      expect(() => parser.parse('de fuchsia')).toThrow(/Unknown tincture: fuchsia/);
    });

    test('carries the elision rule into both halves', () => {
      expect(() => parser.parse("Parti d'azur et de or")).toThrow(/expected "d'or"/);
    });
  });
});
