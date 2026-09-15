import { describe, expect, test } from 'vitest';
import { DivisionType } from '../../domain/models/Field';
import { OrdinaryType } from '../../domain/models/Ordinary';
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

  describe('a field bearing an ordinary', () => {
    test.each(Object.values(OrdinaryType))('lays %s over the field', (type) => {
      const svg = drawer.draw({
        field: { tincture: Colours.azure },
        ordinary: { type, tincture: Metals.or },
      });
      // The field is painted first and the ordinary over it, so the shield's own
      // colour comes before the band's in the document. A saltire contributes two
      // shapes rather than one, so what follows is counted rather than listed.
      const [field, ...borne] = fills(svg);
      expect(field).toBe(WikipediaColours[Colours.azure]);
      expect(borne.length).toBeGreaterThan(0);
      expect(borne.every((fill) => fill === WikipediaColours[Metals.or])).toBe(true);
    });

    test('draws a fess as a band across the middle of the shield', () => {
      const svg = drawer.draw({
        field: { tincture: Colours.azure },
        ordinary: { type: OrdinaryType.fess, tincture: Metals.or },
      });
      expect(svg).toContain('<rect x="0" y="80" width="200" height="80" fill="#ffd700"/>');
    });

    test('draws a saltire as two limbs crossing, painted alike', () => {
      const svg = drawer.draw({
        field: { tincture: Colours.azure },
        ordinary: { type: OrdinaryType.saltire, tincture: Metals.argent },
      });
      expect(svg.split('<polygon').length - 1).toBe(2);
      expect(fills(svg).slice(1)).toEqual(['#ffffff', '#ffffff']);
    });

    test('keeps the ordinary inside the shield', () => {
      const svg = drawer.draw({
        field: { tincture: Colours.azure },
        ordinary: { type: OrdinaryType.chevron, tincture: Metals.or },
      });
      const arms = svg.slice(svg.indexOf('<g clip-path'), svg.indexOf('</g>'));
      expect(arms).toContain('<polygon');
    });

    test('lays an ordinary on a divided field over both halves', () => {
      const svg = drawer.draw({
        field: {
          type: DivisionType.pale,
          firstTincture: Colours.azure,
          secondTincture: Metals.or,
        },
        ordinary: { type: OrdinaryType.fess, tincture: Colours.gules },
      });
      expect(fills(svg)).toEqual(['#0000ff', '#ffd700', '#ff0000']);
    });

    test('paints an ordinary of the same tincture as its field', () => {
      const svg = drawer.draw({
        field: { tincture: Colours.sable },
        ordinary: { type: OrdinaryType.fess, tincture: Colours.sable },
      });
      expect(fills(svg)).toEqual(['#000000', '#000000']);
    });

    test('carries the pattern an ordinary is painted with', () => {
      const hatched = new SvgBlazonDrawer(HatchingColours);
      const svg = hatched.draw({
        field: { tincture: Metals.or },
        ordinary: { type: OrdinaryType.fess, tincture: Colours.azure },
      });
      const paint = HatchingColours[Colours.azure];
      expect(isPattern(paint)).toBe(true);
      expect(svg.slice(svg.indexOf('<defs>'), svg.indexOf('</defs>'))).toContain('hatch-azure');
      expect(svg).toContain(isPattern(paint) ? `fill="${paint.fill}"` : '');
    });

    test('draws nothing extra when the field bears nothing', () => {
      const bare = drawer.draw({ field: { tincture: Colours.azure } });
      expect(bare).not.toContain('<polygon');
      expect(bare).not.toContain('<rect');
    });

    test('draws what was read from a blazon', () => {
      const svg = drawer.draw(parser.parse("D'azur à la fasce d'or"));
      expect(fills(svg)).toEqual(['#0000ff', '#ffd700']);
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

describe('a field bearing several of one ordinary', () => {
  const polygons = (svg: string) => svg.split('<polygon').length - 1;
  const rects = (svg: string) => svg.split('<rect').length - 1;

  test('draws as many bands as are borne, painted alike', () => {
    const svg = drawer.draw({
      field: { tincture: Colours.azure },
      ordinary: { type: OrdinaryType.chevron, tincture: Metals.or, count: 3 },
    });
    expect(polygons(svg)).toBe(3);
    expect(fills(svg).slice(1)).toEqual(Array(3).fill(WikipediaColours[Metals.or]));
  });

  test('draws two pales as two bands, evenly spaced across the field', () => {
    const svg = drawer.draw({
      field: { tincture: Colours.azure },
      ordinary: { type: OrdinaryType.pale, tincture: Metals.or, count: 2 },
    });
    // A fifth apiece, with a fifth of the field between them and at either edge.
    expect(svg).toContain('<rect x="40" y="0" width="40" height="240" fill="#ffd700"/>');
    expect(svg).toContain('<rect x="120" y="0" width="40" height="240" fill="#ffd700"/>');
  });

  test('narrows the bands to make room for each other', () => {
    const one = drawer.draw({
      field: { tincture: Colours.azure },
      ordinary: { type: OrdinaryType.fess, tincture: Metals.or },
    });
    const three = drawer.draw({
      field: { tincture: Colours.azure },
      ordinary: { type: OrdinaryType.fess, tincture: Metals.or, count: 3 },
    });
    const heights = (svg: string) =>
      Array.from(svg.matchAll(/<rect [^>]*height="(\d+)"/g), (match) => Number(match[1]));
    expect(heights(one)).toEqual([80]);
    expect(heights(three).every((height) => height < 80)).toBe(true);
    expect(rects(three)).toBe(3);
  });

  test('leaves a single band exactly where it was drawn before there could be two', () => {
    const counted = drawer.draw({
      field: { tincture: Colours.azure },
      ordinary: { type: OrdinaryType.bend, tincture: Metals.or, count: 1 },
    });
    const plain = drawer.draw({
      field: { tincture: Colours.azure },
      ordinary: { type: OrdinaryType.bend, tincture: Metals.or },
    });
    expect(counted).toBe(plain);
  });

  test('draws but one of an ordinary borne but once, whatever count it was handed', () => {
    const svg = drawer.draw({
      field: { tincture: Colours.azure },
      ordinary: { type: OrdinaryType.chief, tincture: Metals.or, count: 3 },
    });
    expect(rects(svg)).toBe(1);
  });

  test('keeps every band inside the shield', () => {
    const svg = drawer.draw({
      field: { tincture: Colours.azure },
      ordinary: { type: OrdinaryType.bendSinister, tincture: Metals.or, count: 4 },
    });
    const arms = svg.slice(svg.indexOf('<g clip-path'), svg.indexOf('</g>'));
    expect(polygons(arms)).toBe(4);
  });

  test('paints several bands with one pattern, not one apiece', () => {
    const svg = drawer.draw({
      field: { tincture: Colours.azure },
      ordinary: { type: OrdinaryType.fess, tincture: Furs.ermine, count: 3 },
    });
    expect(svg.split('<pattern').length - 1).toBe(1);
  });
});
