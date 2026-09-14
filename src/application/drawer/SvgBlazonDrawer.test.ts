import { describe, expect, test } from 'vitest';
import { DivisionType } from '../../domain/models/Field';
import { Colours, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { ColorModel } from '../../domain/services/IBlazonDrawer';
import { WikipediaColours } from '../../infra/colours/WikipediaColours';
import { FrenchBlazonParser } from '../parser/FrenchBlazonParser';
import { SvgBlazonDrawer } from './SvgBlazonDrawer';

const drawer = new SvgBlazonDrawer(WikipediaColours);
const parser = new FrenchBlazonParser();

const fills = (svg: string) => Array.from(svg.matchAll(/fill="(#[0-9a-f]{6})"/g), (m) => m[1]);

describe('SvgBlazonDrawer', () => {
  test('draws an SVG document', () => {
    const svg = drawer.draw({ field: { tincture: Colours.azure } });
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
    expect(svg).toContain('viewBox="0 0 200 240"');
  });

  test('opens and closes every tag it writes', () => {
    const svg = drawer.draw({ field: { tincture: Colours.azure } });
    for (const tag of ['svg', 'defs', 'clipPath', 'g']) {
      expect(svg.split(`<${tag}`).length - 1).toBe(svg.split(`</${tag}>`).length - 1);
    }
  });

  test.each(TINCTURES)('paints a plain field of %s with its own colour', (tincture) => {
    expect(fills(drawer.draw({ field: { tincture } }))).toEqual([WikipediaColours[tincture]]);
  });

  test('clips the field to the shield and outlines it', () => {
    const svg = drawer.draw({ field: { tincture: Metals.argent } });
    expect(svg).toContain('clip-path="url(#blason-shield)"');
    expect(svg).toContain('stroke-width="3"');
  });

  describe('divided fields', () => {
    test.each(Object.values(DivisionType))('paints both halves of a field per %s', (type) => {
      const svg = drawer.draw({
        field: { type, firstTincture: Colours.azure, secondTincture: Metals.or },
      });
      expect(fills(svg)).toEqual([WikipediaColours[Colours.azure], WikipediaColours[Metals.or]]);
    });

    test('gives the first tincture the half in chief', () => {
      const perPale = drawer.draw({
        field: {
          type: DivisionType.pale,
          firstTincture: Colours.gules,
          secondTincture: Metals.argent,
        },
      });
      // Dexter is the viewer's left, so the first tincture starts at x=0.
      expect(perPale).toContain(`<rect x="0" y="0" width="100" height="240" fill="#ff0000"/>`);
      expect(perPale).toContain(`<rect x="100" y="0" width="100" height="240" fill="#ffffff"/>`);
    });

    test('paints the same tincture on both sides when asked', () => {
      const svg = drawer.draw({
        field: {
          type: DivisionType.fess,
          firstTincture: Colours.sable,
          secondTincture: Colours.sable,
        },
      });
      expect(fills(svg)).toEqual(['#000000', '#000000']);
    });
  });

  describe('colours', () => {
    const monochrome: ColorModel = Object.fromEntries(
      TINCTURES.map((tincture) => [tincture, '#123456'])
    ) as ColorModel;

    test('prefers the colours given at the call over the ones it was built with', () => {
      const svg = drawer.draw({ field: { tincture: Colours.vert } }, { colorModel: monochrome });
      expect(fills(svg)).toEqual(['#123456']);
    });

    test('falls back to the colours it was built with', () => {
      expect(fills(drawer.draw({ field: { tincture: Colours.vert } }))).toEqual(['#008000']);
    });

    test('escapes a colour that would otherwise break out of the attribute', () => {
      const hostile = { ...WikipediaColours, [Colours.vert]: '"><script/>' };
      const svg = drawer.draw({ field: { tincture: Colours.vert } }, { colorModel: hostile });
      expect(svg).not.toContain('<script/>');
      expect(svg).toContain('&quot;&gt;&lt;script/&gt;');
    });
  });

  test('draws what was read from a blazon', () => {
    const svg = drawer.draw(parser.parse("Parti d'azur et d'or"));
    expect(fills(svg)).toEqual(['#0000ff', '#ffd700']);
  });
});

describe('WikipediaColours', () => {
  test.each(TINCTURES)('gives %s a colour', (tincture) => {
    expect(WikipediaColours[tincture]).toMatch(/^#[0-9a-f]{6}$/);
  });

  test('gives no two tinctures the same colour', () => {
    const used = TINCTURES.map((tincture) => WikipediaColours[tincture]);
    expect(new Set(used).size).toBe(used.length);
  });
});
