import { describe, expect, test } from 'vitest';
import { DivisionType } from '../../domain/models/Field';
import { Colours, Furs, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { ColorModel, isPattern } from '../../domain/services/IBlazonDrawer';
import { HatchingColours } from '../../infra/colours/HatchingColours';
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

  const PLAIN = TINCTURES.filter((tincture) => !isPattern(WikipediaColours[tincture]));

  test.each(PLAIN)('paints a plain field of %s with its own colour', (tincture) => {
    expect(fills(drawer.draw({ field: { tincture } }))).toEqual([WikipediaColours[tincture]]);
  });

  test.each(Object.values(Furs))('covers a field of %s with its own pelt', (fur) => {
    const paint = WikipediaColours[fur];
    const svg = drawer.draw({ field: { tincture: fur } });
    expect(isPattern(paint)).toBe(true);
    expect(svg).toContain(isPattern(paint) ? paint.fill : '');
    expect(svg).toContain('<pattern');
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

describe('painting with patterns rather than colours', () => {
  const hatched = new SvgBlazonDrawer(HatchingColours);

  const defs = (svg: string) => svg.slice(svg.indexOf('<defs>'), svg.indexOf('</defs>'));

  test('fills the field by referring to the pattern', () => {
    const svg = hatched.draw({ field: { tincture: Colours.azure } });
    expect(svg).toContain('fill="url(#hatch-azure)"');
  });

  test('carries the definition the fill refers to', () => {
    const svg = hatched.draw({ field: { tincture: Colours.azure } });
    expect(defs(svg)).toContain('<pattern id="hatch-azure"');
  });

  test('carries only the patterns the field is painted with', () => {
    const svg = hatched.draw({ field: { tincture: Colours.azure } });
    expect(defs(svg)).not.toContain('hatch-gules');
    expect(defs(svg)).not.toContain('hatch-vert');
  });

  test('carries both patterns of a divided field', () => {
    const svg = hatched.draw({
      field: {
        type: DivisionType.pale,
        firstTincture: Colours.azure,
        secondTincture: Colours.gules,
      },
    });
    expect(defs(svg)).toContain('<pattern id="hatch-azure"');
    expect(defs(svg)).toContain('<pattern id="hatch-gules"');
  });

  test('carries a shared pattern once, not twice', () => {
    const svg = hatched.draw({
      field: {
        type: DivisionType.fess,
        firstTincture: Colours.sable,
        secondTincture: Colours.sable,
      },
    });
    expect(svg.split('<pattern id="hatch-sable"').length - 1).toBe(1);
  });

  test('still paints a tincture that wants a plain colour', () => {
    const svg = hatched.draw({ field: { tincture: Metals.argent } });
    expect(svg).toContain('fill="#ffffff"');
    expect(defs(svg)).not.toContain('<pattern');
  });

  test('needs no pattern at all for a colour model that has none', () => {
    const svg = drawer.draw({ field: { tincture: Colours.azure } });
    expect(defs(svg)).not.toContain('<pattern');
  });
});

describe('WikipediaColours', () => {
  test.each(TINCTURES)('paints %s', (tincture) => {
    const paint = WikipediaColours[tincture];
    expect(isPattern(paint) ? paint.fill : paint).toMatch(/^(#[0-9a-f]{6}|url\(#.+\))$/);
  });

  test('paints no two tinctures alike', () => {
    const used = TINCTURES.map((tincture) => {
      const paint = WikipediaColours[tincture];
      return isPattern(paint) ? paint.fill : paint;
    });
    expect(new Set(used).size).toBe(used.length);
  });
});
