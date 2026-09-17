import { describe, expect, test } from 'vitest';
import { COLOURS, Colours, Furs, METALS, Metals, PELTS, TINCTURES } from '../models/Tinctures';
import { Word } from './Word';

describe('a word that says nothing about tincture', () => {
  const billet = new Word('billet');

  test('is borne in any of them, a shape being a shape whatever it is painted', () => {
    expect(billet.allowedTinctures).toEqual(TINCTURES);
    expect(TINCTURES.every((tincture) => billet.accepts(tincture))).toBe(true);
  });

  test('understands none of them, so a blazon bearing it must say which', () => {
    expect(billet.defaultTincture).toBeUndefined();
  });
});

describe('a word that is a tincture as well as a name', () => {
  const plate = new Word('plate', { defaultTincture: Metals.argent });

  test('is understood to be that tincture where the blazon names none', () => {
    expect(plate.defaultTincture).toBe(Metals.argent);
  });

  test('takes that tincture and no other, the name having already said it', () => {
    expect(plate.accepts(Metals.argent)).toBe(true);
    expect(plate.accepts(Metals.or)).toBe(false);
    expect(plate.accepts(Furs.ermine)).toBe(false);
  });
});

describe('a word borne in a whole rank of tinctures', () => {
  const besant = new Word('besant', {
    allowedTinctures: [...METALS, ...PELTS],
    defaultTincture: Metals.or,
  });

  test('means one of them and accepts the rest, which is what a rank is for', () => {
    expect(besant.defaultTincture).toBe(Metals.or);
    expect(besant.accepts(Metals.argent)).toBe(true);
    expect(besant.accepts(Furs.vair)).toBe(true);
  });

  test('still refuses everything outside the rank', () => {
    expect(COLOURS.some((colour) => besant.accepts(colour))).toBe(false);
  });
});

describe('a word borne in a rank and understood to be none of it', () => {
  const tourteau = new Word('tourteau', { allowedTinctures: [...COLOURS] });

  test('takes the rank entire and must always be told which', () => {
    expect(tourteau.defaultTincture).toBeUndefined();
    expect(tourteau.accepts(Colours.gules)).toBe(true);
    expect(tourteau.accepts(Metals.or)).toBe(false);
  });
});
