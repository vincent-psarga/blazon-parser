import { describe, expect, test } from 'vitest';
import { Colours, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { isPattern } from '../../domain/services/IBlazonDrawer';
import { HatchingColours } from './HatchingColours';

const patternOf = (tincture: (typeof TINCTURES)[number]) => {
  const paint = HatchingColours[tincture];
  if (!isPattern(paint)) {
    throw new Error(`${tincture} is not hatched`);
  }
  return paint;
};

describe('HatchingColours', () => {
  test.each(TINCTURES)('paints %s', (tincture) => {
    expect(HatchingColours[tincture]).toBeDefined();
  });

  test('leaves argent blank, the paper standing for the metal', () => {
    expect(HatchingColours[Metals.argent]).toBe('#ffffff');
  });

  test.each(TINCTURES.filter((tincture) => tincture !== Metals.argent))(
    'hatches %s rather than colouring it',
    (tincture) => {
      expect(isPattern(HatchingColours[tincture])).toBe(true);
    }
  );

  test('gives every hatch its own definition, so none masks another', () => {
    const hatched = TINCTURES.filter((tincture) => tincture !== Metals.argent);
    const fills = hatched.map((tincture) => patternOf(tincture).fill);
    expect(new Set(fills).size).toBe(fills.length);
  });

  test('names each definition with the fill that refers to it', () => {
    for (const tincture of TINCTURES.filter((candidate) => candidate !== Metals.argent)) {
      const { fill, definition } = patternOf(tincture);
      const id = fill.match(/^url\(#(.+)\)$/)?.[1];
      expect(id, `${tincture} has no usable fill`).toBeDefined();
      expect(definition).toContain(`id="${id}"`);
    }
  });

  describe('the marks each tincture carries', () => {
    test('rules azure horizontally and gules vertically', () => {
      expect(patternOf(Colours.azure).definition).toContain('M0 5 H10');
      expect(patternOf(Colours.gules).definition).toContain('M5 0 V10');
    });

    test('rules sable both ways at once', () => {
      const sable = patternOf(Colours.sable).definition;
      expect(sable).toContain('M0 5 H10');
      expect(sable).toContain('M5 0 V10');
    });

    test('turns vert onto the diagonal a bend runs along', () => {
      expect(patternOf(Colours.vert).definition).toContain('rotate(45)');
    });

    test('dots or', () => {
      expect(patternOf(Metals.or).definition).toContain('<circle');
    });
  });
});
