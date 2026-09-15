import { describe, expect, test } from 'vitest';
import { OrdinaryType, SEVERAL, borne, bornInNumber } from './Ordinary';
import { Metals } from './Tinctures';

describe('an ordinary borne in number', () => {
  test.each([
    OrdinaryType.pale,
    OrdinaryType.fess,
    OrdinaryType.bend,
    OrdinaryType.bendSinister,
    OrdinaryType.chevron,
  ])('a field may bear several of %s', (type) => {
    expect(bornInNumber(type)).toBe(true);
  });

  test.each([OrdinaryType.chief, OrdinaryType.cross, OrdinaryType.saltire, OrdinaryType.bordure])(
    'a field bears but one %s',
    (type) => {
      expect(bornInNumber(type)).toBe(false);
    }
  );

  test('says of every ordinary in the vocabulary which it is', () => {
    for (const type of Object.values(OrdinaryType)) {
      expect(typeof bornInNumber(type)).toBe('boolean');
    }
  });
});

describe('how many are borne', () => {
  test('is one where the blazon named no number', () => {
    expect(borne({ type: OrdinaryType.chevron, tincture: Metals.or })).toBe(1);
  });

  test('is what the blazon counted, where it counted', () => {
    expect(borne({ type: OrdinaryType.chevron, tincture: Metals.or, count: 3 })).toBe(3);
  });

  test('is one for an ordinary borne but once, whatever count it was handed', () => {
    expect(borne({ type: OrdinaryType.chief, tincture: Metals.or, count: 3 })).toBe(1);
  });

  test('counts several from two', () => {
    expect(SEVERAL).toBe(2);
  });
});
