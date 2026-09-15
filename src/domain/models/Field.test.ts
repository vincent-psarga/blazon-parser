import { describe, expect, test } from 'vitest';
import {
  DivisionType,
  FurType,
  PIECES,
  VariationType,
  cutInPieces,
  isDivision,
  isFurred,
  isVariation,
  usualPieces,
} from './Field';
import { Colours, Metals } from './Tinctures';

const PLAIN = { tincture: Metals.or };

const DIVIDED = {
  type: DivisionType.fess,
  firstTincture: Metals.or,
  secondTincture: Colours.azure,
};

const VARIED = {
  type: VariationType.barry,
  firstTincture: Metals.or,
  secondTincture: Colours.azure,
  pieces: 6,
};

const FURRED = {
  type: FurType.vairy,
  firstTincture: Metals.or,
  secondTincture: Colours.azure,
};

describe('telling one kind of field from another', () => {
  test('a plain field is none of divided, varied or furred', () => {
    expect(isDivision(PLAIN)).toBe(false);
    expect(isVariation(PLAIN)).toBe(false);
    expect(isFurred(PLAIN)).toBe(false);
  });

  test('a divided field is divided, and is neither variation nor pelt', () => {
    expect(isDivision(DIVIDED)).toBe(true);
    expect(isVariation(DIVIDED)).toBe(false);
    expect(isFurred(DIVIDED)).toBe(false);
  });

  test('a furred field is furred, and is neither division nor variation', () => {
    // All three carry a type and two tinctures, so what tells them apart is
    // which vocabulary the term belongs to rather than the shape of the object.
    expect(isFurred(FURRED)).toBe(true);
    expect(isDivision(FURRED)).toBe(false);
    expect(isVariation(FURRED)).toBe(false);
  });

  test('a varied field is a variation, and is neither division nor pelt', () => {
    // Both name a line and both carry two tinctures, so what tells them apart is
    // which vocabulary the term belongs to rather than the shape of the object.
    expect(isVariation(VARIED)).toBe(true);
    expect(isDivision(VARIED)).toBe(false);
    expect(isFurred(VARIED)).toBe(false);
  });

  test.each(Object.values(DivisionType))('%s is a division', (type) => {
    expect(isDivision({ ...DIVIDED, type })).toBe(true);
  });

  test.each(Object.values(VariationType))('%s is a variation', (type) => {
    expect(isVariation({ ...VARIED, type })).toBe(true);
  });

  test.each(Object.values(FurType))('%s is a furred field', (type) => {
    expect(isFurred({ ...FURRED, type })).toBe(true);
  });
});

describe('how many pieces a varied field is understood to have', () => {
  test.each([
    VariationType.barry,
    VariationType.paly,
    VariationType.bendy,
    VariationType.chevronny,
  ])('%s is understood to be cut in six', (type) => {
    expect(usualPieces(type)).toBe(6);
  });

  test('the pily is understood to be cut in no particular number', () => {
    // Neither tongue settles one, so a blazon that says nothing is refused
    // rather than guessed at.
    expect(usualPieces(VariationType.pily)).toBeUndefined();
  });

  test('says of every varied field in the vocabulary which it is', () => {
    for (const type of Object.values(VariationType)) {
      const usual = usualPieces(type);
      expect(usual === undefined || cutInPieces(type, usual)).toBe(true);
    }
  });
});

describe('a number of pieces a field may be cut into', () => {
  test.each([2, 4, 6, 8, 10, 16])('%i pieces is a field cut evenly', (pieces) => {
    expect(cutInPieces(VariationType.barry, pieces)).toBe(true);
  });

  test.each([3, 5, 7, 9])('%i pieces is no barry: the tinctures would not alternate', (pieces) => {
    expect(cutInPieces(VariationType.barry, pieces)).toBe(false);
  });

  test.each([0, 1])('%i is no number of pieces at all', (pieces) => {
    expect(cutInPieces(VariationType.barry, pieces)).toBe(false);
    expect(cutInPieces(VariationType.pily, pieces)).toBe(false);
  });

  test.each([3, 5, 7])('the pily is counted odd as readily as even: %i', (pieces) => {
    // Its pieces interlock rather than follow one another, so a whole pile at
    // either flank leaves an odd count — Parker counts "seven traits".
    expect(cutInPieces(VariationType.pily, pieces)).toBe(true);
  });

  test('counts pieces from two, which is the fewest a field can be cut into', () => {
    expect(PIECES).toBe(2);
    expect(cutInPieces(VariationType.paly, PIECES)).toBe(true);
  });
});
