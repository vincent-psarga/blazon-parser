import { Blazon } from '../../domain/models/Blazon';
import { DivisionType, Field, isDivision } from '../../domain/models/Field';
import { Ordinary, OrdinaryType, borne } from '../../domain/models/Ordinary';
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

type Shape = (fill: string) => string;

const rect =
  (x: number, y: number, width: number, height: number): Shape =>
  (fill) =>
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`;

const polygon =
  (points: string): Shape =>
  (fill) =>
    `<polygon points="${points}" fill="${fill}"/>`;

/** Several shapes painted alike: an ordinary that crosses itself, or repeats. */
const all =
  (shapes: readonly Shape[]): Shape =>
  (fill) =>
    shapes.map((shape) => shape(fill)).join('');

/**
 * Where the two halves of a divided field lie, before the shield clips them.
 *
 * The first tincture takes the half in chief: the one that reaches the top of
 * the shield, which for a diagonal is the triangle on the far side of the line
 * from where it starts. Being keyed on DivisionType, a partition added to the
 * vocabulary breaks this until it is given a shape.
 */
const HALVES: Record<DivisionType, readonly [Shape, Shape]> = {
  [DivisionType.pale]: [rect(0, 0, 100, HEIGHT), rect(100, 0, 100, HEIGHT)],
  [DivisionType.fess]: [rect(0, 0, WIDTH, 120), rect(0, 120, WIDTH, 120)],
  [DivisionType.bend]: [polygon('0,0 200,0 200,240'), polygon('0,0 200,240 0,240')],
  [DivisionType.bendSinister]: [polygon('200,0 0,0 0,240'), polygon('200,0 0,240 200,240')],
};

/** A band's place across the field: where it begins, and how far it runs. */
type Band = readonly [at: number, across: number];

/**
 * Where a given number of bands lie across the room they share.
 *
 * The room is cut into equal parts, one more part than there are bands twice
 * over, and the bands take every other part: a single band takes the middle
 * third, two take the second and fourth fifths, three the second, fourth and
 * sixth sevenths. That is what heraldry does when a field bears several of an
 * ordinary — the bands narrow to make room for each other, evenly, rather than
 * crowding to one side — and it leaves a single band exactly where it was drawn
 * before there could be two.
 *
 * It is the edges that are rounded rather than the width, so that neighbouring
 * bands keep whole numbers between them.
 */
function bands(count: number, from: number, extent: number): readonly Band[] {
  const part = extent / (2 * count + 1);
  return Array.from({ length: count }, (_, band) => {
    const at = Math.round(from + (2 * band + 1) * part);
    return [at, Math.round(from + (2 * band + 2) * part) - at] as const;
  });
}

/**
 * A band running corner to corner, given where it cuts the top edge of the
 * field. Its width is measured across the shield rather than square to the band:
 * the diagonal is drawn by sliding the top and bottom edges sideways, which
 * keeps the arithmetic in whole numbers.
 */
const bendBand = ([at, across]: Band): Shape =>
  polygon(`${at},0 ${at + across},0 ${WIDTH + at + across},${HEIGHT} ${WIDTH + at},${HEIGHT}`);

const bendSinisterBand = ([at, across]: Band): Shape =>
  polygon(`${WIDTH + at},0 ${WIDTH + at + across},0 ${at + across},${HEIGHT} ${at},${HEIGHT}`);

/** A band bent to a point, given where its upper edge reaches that point. */
const chevronBand = ([at, across]: Band): Shape =>
  polygon(
    `0,${at + RISE} 100,${at} 200,${at + RISE} ` +
      `200,${at + RISE + across} 100,${at + across} 0,${at + RISE + across}`
  );

/** A chief takes a third of the shield, as every single band does. */
const CHIEF = 80;

/**
 * The room the diagonals share, measured across the top edge of the field. It is
 * wider than the field because a diagonal crosses it at a slant: a single bend
 * takes the middle third of this, which is the third of the field it should be.
 */
const DIAGONALS = 240;

/** The room the chevrons share, measured down the field from their highest point. */
const CHEVRONS_FROM = 8;
const CHEVRONS = 180;

/** How far a chevron's limbs climb from the edge of the field to its point. */
const RISE = 100;

/** Limbs that cross are narrower than a band that does not, being two. */
const LIMB = 26;
const ARM = 28;

/**
 * The band, or bands, each ordinary lays over the field, before the shield clips
 * them.
 *
 * Every one is drawn past the edges it meets and left to the clip path, so the
 * band keeps its own width and angle instead of being fitted to the shield's
 * curve. Being keyed on OrdinaryType, an ordinary added to the vocabulary breaks
 * this until it is given a shape.
 *
 * Each is asked how many are borne, and the ones borne but once are entitled to
 * ignore the answer: a chief is the top of the shield and there is one of those.
 */
const ORDINARIES: Record<OrdinaryType, (count: number) => Shape> = {
  // A third of the shield each: across the top, down the middle, across the waist.
  [OrdinaryType.chief]: () => rect(0, 0, WIDTH, CHIEF),
  [OrdinaryType.pale]: (count) =>
    all(bands(count, 0, WIDTH).map(([at, across]) => rect(at, 0, across, HEIGHT))),
  [OrdinaryType.fess]: (count) =>
    all(bands(count, 0, HEIGHT).map(([at, across]) => rect(0, at, WIDTH, across))),
  [OrdinaryType.bend]: (count) => all(bands(count, -DIAGONALS / 2, DIAGONALS).map(bendBand)),
  [OrdinaryType.bendSinister]: (count) =>
    all(bands(count, -DIAGONALS / 2, DIAGONALS).map(bendSinisterBand)),
  [OrdinaryType.chevron]: (count) => all(bands(count, CHEVRONS_FROM, CHEVRONS).map(chevronBand)),
  // The last two are one charge apiece for all that they are drawn twice over:
  // the cross is the pale and the fess crossing, the saltire the two diagonals.
  [OrdinaryType.cross]: () =>
    all([rect(WIDTH / 2 - ARM, 0, ARM * 2, HEIGHT), rect(0, HEIGHT / 2 - ARM, WIDTH, ARM * 2)]),
  [OrdinaryType.saltire]: () =>
    all([bendBand([-LIMB, LIMB * 2]), bendSinisterBand([-LIMB, LIMB * 2])]),
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
      patternsFor(blazon, colours),
      `</defs>`,
      `<g clip-path="url(#${SHIELD_CLIP})">${this.paintArms(blazon, colours)}</g>`,
      `<path d="${SHIELD}" fill="none" stroke="${escapeAttribute(this.outline)}" stroke-width="${OUTLINE_WIDTH}"/>`,
      `</svg>`,
    ].join('');
  }

  /** The field first, then whatever it bears: an ordinary is laid over, not under. */
  private paintArms(blazon: Blazon, colours: ColorModel): string {
    const field = this.paintField(blazon.field, colours);
    return blazon.ordinary === undefined ? field : field + paintOrdinary(blazon.ordinary, colours);
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

function paintOrdinary(ordinary: Ordinary, colours: ColorModel): string {
  return ORDINARIES[ordinary.type](borne(ordinary))(colourOf(colours, ordinary.tincture));
}

function colourOf(colours: ColorModel, tincture: Tincture): string {
  const paint = colours[tincture];
  return escapeAttribute(isPattern(paint) ? paint.fill : paint);
}

function tincturesOf(blazon: Blazon): readonly Tincture[] {
  const field = isDivision(blazon.field)
    ? [blazon.field.firstTincture, blazon.field.secondTincture]
    : [blazon.field.tincture];
  return blazon.ordinary === undefined ? field : [...field, blazon.ordinary.tincture];
}

/**
 * The definitions the blazon's own tinctures call for, and no others — a shield
 * carries the patterns it is painted with, not every pattern that exists. An
 * ordinary counts among them: it is painted with a tincture like anything else.
 *
 * A definition is markup, so it is placed as it stands rather than escaped. A
 * colour model is written in code alongside the drawer, not taken from a reader.
 */
function patternsFor(blazon: Blazon, colours: ColorModel): string {
  const definitions = new Map<string, string>();
  for (const tincture of tincturesOf(blazon)) {
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
