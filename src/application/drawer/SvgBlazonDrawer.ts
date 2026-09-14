import { Blazon } from '../../domain/models/Blazon';
import { DivisionType, Field, isDivision } from '../../domain/models/Field';
import { Tincture } from '../../domain/models/Tinctures';
import {
  ColorModel,
  DrawOptions,
  IBlazonDrawer,
  isPattern,
} from '../../domain/services/IBlazonDrawer';

const WIDTH = 200;
const HEIGHT = 240;

/** A heater shield, inset far enough that its own outline is not clipped away. */
const SHIELD = 'M6 6 H194 V128 C194 186 150 220 100 234 C50 220 6 186 6 128 Z';

const DEFAULT_OUTLINE = '#1a1a1a';
const OUTLINE_WIDTH = 3;

// Two SVGs inlined in one document share an id space, so this one is spelled out
// rather than left to collide with whatever else the page calls its clip path.
const SHIELD_CLIP = 'blason-shield';

type Half = (fill: string) => string;

const rect =
  (x: number, y: number, width: number, height: number): Half =>
  (fill) =>
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`;

const triangle =
  (points: string): Half =>
  (fill) =>
    `<polygon points="${points}" fill="${fill}"/>`;

/**
 * Where the two halves of a divided field lie, before the shield clips them.
 *
 * The first tincture takes the half in chief: the one that reaches the top of
 * the shield, which for a diagonal is the triangle on the far side of the line
 * from where it starts. Being keyed on DivisionType, a partition added to the
 * vocabulary breaks this until it is given a shape.
 */
const HALVES: Record<DivisionType, readonly [Half, Half]> = {
  [DivisionType.pale]: [rect(0, 0, 100, HEIGHT), rect(100, 0, 100, HEIGHT)],
  [DivisionType.fess]: [rect(0, 0, WIDTH, 120), rect(0, 120, WIDTH, 120)],
  [DivisionType.bend]: [triangle('0,0 200,0 200,240'), triangle('0,0 200,240 0,240')],
  [DivisionType.bendSinister]: [triangle('200,0 0,0 0,240'), triangle('200,0 0,240 200,240')],
};

/** Draws a blazon as an SVG shield. */
export class SvgBlazonDrawer implements IBlazonDrawer {
  /**
   * The outline is a property of the ground the arms are drawn on, not of the
   * arms, so it is supplied rather than assumed: a shield drawn near-black
   * vanishes on a dark page, which is the one thing a drawing must never do.
   */
  constructor(
    private readonly colours: ColorModel,
    private readonly outline: string = DEFAULT_OUTLINE
  ) {}

  draw(blazon: Blazon, drawOptions?: DrawOptions): string {
    const colours = drawOptions?.colorModel ?? this.colours;

    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}"`,
      ` width="${WIDTH}" height="${HEIGHT}">`,
      `<defs><clipPath id="${SHIELD_CLIP}"><path d="${SHIELD}"/></clipPath>`,
      patternsFor(blazon.field, colours),
      `</defs>`,
      `<g clip-path="url(#${SHIELD_CLIP})">${this.paintField(blazon.field, colours)}</g>`,
      `<path d="${SHIELD}" fill="none" stroke="${escapeAttribute(this.outline)}" stroke-width="${OUTLINE_WIDTH}"/>`,
      `</svg>`,
    ].join('');
  }

  private paintField(field: Field, colours: ColorModel): string {
    if (!isDivision(field)) {
      return `<path d="${SHIELD}" fill="${colourOf(colours, field.tincture)}"/>`;
    }

    const [inChief, inBase] = HALVES[field.type];
    return (
      inChief(colourOf(colours, field.firstTincture)) +
      inBase(colourOf(colours, field.secondTincture))
    );
  }
}

function colourOf(colours: ColorModel, tincture: Tincture): string {
  const paint = colours[tincture];
  return escapeAttribute(isPattern(paint) ? paint.fill : paint);
}

function tincturesOf(field: Field): readonly Tincture[] {
  return isDivision(field) ? [field.firstTincture, field.secondTincture] : [field.tincture];
}

/**
 * The definitions the field's own tinctures call for, and no others — a shield
 * carries the patterns it is painted with, not every pattern that exists.
 *
 * A definition is markup, so it is placed as it stands rather than escaped. A
 * colour model is written in code alongside the drawer, not taken from a reader.
 */
function patternsFor(field: Field, colours: ColorModel): string {
  const definitions = new Map<string, string>();
  for (const tincture of tincturesOf(field)) {
    const paint = colours[tincture];
    if (isPattern(paint)) {
      definitions.set(paint.fill, paint.definition);
    }
  }
  return [...definitions.values()].join('');
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
