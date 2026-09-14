import { describe, expect, test } from 'vitest';
import { parseBlazon } from './Parser';
import { DivisionType } from '../../domain/models/Field';

describe('divided fields', () => {
  test('reads "Parti d\'azur et d\'or" as a field divided per pale', () => {
    expect(parseBlazon("Parti d'azur et d'or")).toEqual({
      field: {
        type: DivisionType.pale,
        firstTincture: 'azur',
        secondTincture: 'or',
      },
    });
  });

  test.each([
    ['parti', DivisionType.pale],
    ['coupé', DivisionType.fess],
    ['tranché', DivisionType.bend],
    ['taillé', DivisionType.bendSinister],
  ])('%s divides the field per %s', (name, type) => {
    expect(parseBlazon(`${name} de gueules et d'argent`)).toEqual({
      field: { type, firstTincture: 'gueules', secondTincture: 'argent' },
    });
  });

  test('accepts tinctures named without their article', () => {
    expect(parseBlazon('Parti azur et or')).toEqual({
      field: { type: DivisionType.pale, firstTincture: 'azur', secondTincture: 'or' },
    });
  });

  test('accepts the same tincture on both sides', () => {
    expect(parseBlazon("Coupé d'or et d'or")).toEqual({
      field: { type: DivisionType.fess, firstTincture: 'or', secondTincture: 'or' },
    });
  });

  test('is case insensitive', () => {
    expect(parseBlazon("TRANCHÉ D'AZUR ET DE SABLE")).toEqual({
      field: { type: DivisionType.bend, firstTincture: 'azur', secondTincture: 'sable' },
    });
  });

  test('reads an accent that arrives decomposed', () => {
    const decomposed = "Coupé d'or et de sable".normalize('NFD');
    expect(decomposed).not.toBe("Coupé d'or et de sable");
    expect(parseBlazon(decomposed)).toEqual({
      field: { type: DivisionType.fess, firstTincture: 'or', secondTincture: 'sable' },
    });
  });

  test('closes with the optional full stop', () => {
    expect(parseBlazon("Parti d'azur et d'or.")).toEqual({
      field: { type: DivisionType.pale, firstTincture: 'azur', secondTincture: 'or' },
    });
  });

  describe('rejections', () => {
    test('rejects a division naming only one tincture', () => {
      expect(() => parseBlazon("Parti d'azur")).toThrow();
    });

    test('rejects two tinctures without "et"', () => {
      expect(() => parseBlazon("Parti d'azur d'or")).toThrow();
    });

    test('rejects an unknown division', () => {
      expect(() => parseBlazon("Écartelé d'azur et d'or")).toThrow();
    });

    test('still reports an unknown tincture rather than an unknown division', () => {
      expect(() => parseBlazon('de fuchsia')).toThrow(/Unknown tincture: fuchsia/);
    });

    test('carries the elision rule into both halves', () => {
      expect(() => parseBlazon("Parti d'azur et de or")).toThrow(/expected "d'or"/);
    });
  });
});
