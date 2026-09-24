import { describe, expect, test } from 'vitest';
import { ChargeType } from '../../../domain/models/Charge';
import { OrdinaryType } from '../../../domain/models/Ordinary';
import { Colours, Metals, Shade } from '../../../domain/models/Tinctures';
import { isPattern } from '../../../domain/services/IBlazonDrawer';
import { HatchingColours } from '../../../infra/colours/HatchingColours';
import { WikipediaColours } from '../../../infra/colours/WikipediaColours';
import { SHIELD_FRAME } from './shapes/shield';
import { SvgBlazonDrawer } from './SvgBlazonDrawer';
import { strewing } from './vocabulary/charges/disposition';
import { FieldType, Plain } from '../../../domain/models/Field';
import { Blazon } from '../../../domain/models/Blazon';

const drawer = new SvgBlazonDrawer(WikipediaColours);

const FIELD: Plain = {
  type: FieldType.plain,
  tincture: Colours.azure,
  semy: { type: ChargeType.billet, tincture: Metals.or },
};

const SOWN: Blazon = { field: FIELD };

/** What is drawn inside the clipped group, the outline being drawn outside it. */
const inside = (svg: string) => {
  const from = svg.indexOf('<g clip-path');
  return svg.slice(from, svg.indexOf('</g>', from));
};

const paints = (svg: string) => Array.from(inside(svg).matchAll(/="(#[0-9a-f]{6})"/g), (m) => m[1]);

/** The plain colour a tincture is painted with here, these arms using no pattern. */
const colour = (tincture: Shade): string => {
  const paint = WikipediaColours[tincture];
  expect(isPattern(paint)).toBe(false);
  return paint as string;
};

describe('the spots a semy is sown at', () => {
  const spots = strewing(SHIELD_FRAME);

  test('covers the shield rather than the room a counted charge is given', () => {
    expect(spots.length).toBeGreaterThan(20);
  });

  test('draws them small, which is what tells a semy from a count of charges', () => {
    for (const { size } of spots) {
      expect(size).toBeLessThan(40);
    }
  });

  test('starts at the frame’s own corner, so the chief row is not swallowed', () => {
    expect(spots[0].y).toBe(SHIELD_FRAME.top);
  });

  test('lays every other row half a step along, so the rows fall between one another', () => {
    const rows = new Map<number, number[]>();
    for (const { x, y } of spots) {
      rows.set(y, [...(rows.get(y) ?? []), x]);
    }
    const [first, second] = [...rows.values()];
    expect(second[0]).not.toBe(first[0]);
  });

  test('runs past the edges either side, for the shield to cut', () => {
    const xs = spots.map(({ x }) => x);
    expect(Math.min(...xs)).toBeLessThan(SHIELD_FRAME.dexter);
    expect(Math.max(...xs)).toBeGreaterThan(SHIELD_FRAME.sinister);
  });

  test('reaches below the base, the point of a heater being the lowest thing on it', () => {
    expect(Math.max(...spots.map(({ y }) => y))).toBeGreaterThanOrEqual(SHIELD_FRAME.base);
  });
});

describe('drawing a sown field', () => {
  test('lays the field entire and sows the figures over it', () => {
    const [ground, ...sown] = paints(drawer.draw(SOWN));
    expect(ground).toBe(colour(Colours.azure));
    expect(new Set(sown)).toEqual(new Set([colour(Metals.or)]));
  });

  test('sows as many figures as the strewing has spots', () => {
    const svg = inside(drawer.draw(SOWN));
    expect(svg.split('<rect').length - 1).toBe(strewing(SHIELD_FRAME).length);
  });

  test('draws nothing sown where nothing was sown', () => {
    const svg = inside(drawer.draw({ field: { type: FieldType.plain, tincture: Colours.azure } }));
    expect(svg).not.toContain('<rect');
  });

  test('sows the figure the charge is drawn as, so a semy needs no second drawing', () => {
    const svg = inside(
      drawer.draw({
        ...SOWN,
        field: { ...FIELD, semy: { type: ChargeType.roundel, tincture: Metals.or } },
      })
    );
    expect(svg).toContain('<circle');
  });

  test('lays what the field bears over the sowing, as it lies over the tincture', () => {
    const svg = inside(
      drawer.draw({
        ...SOWN,
        chargesOrOrdinaries: [{ type: OrdinaryType.bordure, tincture: Colours.gules }],
      })
    );
    expect(svg.lastIndexOf(colour(Colours.gules))).toBeGreaterThan(
      svg.lastIndexOf(colour(Metals.or))
    );
  });

  test('carries the pattern a sown figure is painted with', () => {
    const hatched = new SvgBlazonDrawer(HatchingColours);
    const svg = hatched.draw({
      field: {
        type: FieldType.plain,
        tincture: Colours.azure,
        semy: { type: ChargeType.billet, tincture: Colours.gules },
      },
    });
    const sown = HatchingColours[Colours.gules];
    expect(typeof sown).not.toBe('string');
    expect(svg).toContain(`<pattern id="${(sown as { fill: string }).fill.slice(5, -1)}"`);
  });
});
