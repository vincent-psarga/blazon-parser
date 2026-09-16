import { Blazon, ChargeOrOrdinary, isOrdinary } from '../../domain/models/Blazon';
import { Charge, ChargeType, numberBorne } from '../../domain/models/Charge';
import {
  DivisionType,
  Field,
  Furred,
  Variation,
  VariationType,
  isDivision,
  isFurred,
  isVariation,
} from '../../domain/models/Field';
import { Ordinary, OrdinaryType, borne } from '../../domain/models/Ordinary';
import { Tincture } from '../../domain/models/Tinctures';
import {
  ColorModel,
  DrawOptions,
  IBlazonDrawer,
  Pattern,
  isPattern,
} from '../../domain/services/IBlazonDrawer';

const WIDTH = 200;
const HEIGHT = 240;

/** A heater shield, inset far enough that its own outline is not clipped away. */
const SHIELD = 'M6 6 H194 V128 C194 186 150 220 100 234 C50 220 6 186 6 128 Z';

/**
 * How far the shield itself reaches, which is not how far the drawing does: a
 * heater is inset from the edges and comes to a point, so three corners of the
 * box it is drawn in are not on it at all.
 *
 * A varied field cuts the shield rather than the box, so its pieces are measured
 * across these rather than across the whole drawing. Measured across the box, a
 * piece can fall entirely on ground the shield never covers — the lowest stripe
 * of a bendy lies where a square shield would have a corner and a heater has
 * only its point — and a field blazoned in six would be drawn in five.
 *
 * The first four are the path's own numbers. The last two are the furthest a
 * line in bend can be pushed either way and still cross the shield, which the
 * curve of the base decides rather than any corner: a bend line is placed by
 * where it cuts the top edge, so they are read on that scale too.
 */
const SHIELD_TOP = 6;
const SHIELD_BASE = 234;
const SHIELD_DEXTER = 6;
const SHIELD_SINISTER = 194;
const SHIELD_BEND_FROM = -131;
const SHIELD_BEND_TO = 189;

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
 * Where the pieces of a varied field lie that are laid over it.
 *
 * A varied field is cut into equal pieces of two tinctures laid alternately, so
 * it is painted the first tincture entire and every other piece laid over it in
 * the second: half the shapes, and no seam anywhere between two pieces of the
 * one tincture.
 *
 * The pieces laid over are the second, the fourth and so on — save where a field
 * counts its pieces from the end this measures from, as the bendy does, and the
 * first, third and fifth are the ones to lay.
 *
 * It is the edges that are rounded rather than the width, so that neighbouring
 * pieces keep whole numbers between them.
 */
function alternate(pieces: number, from: number, extent: number, first = 1): readonly Band[] {
  const piece = extent / pieces;
  return Array.from({ length: Math.floor((pieces - first + 1) / 2) }, (_, laid) => {
    const at = Math.round(from + (first + 2 * laid) * piece);
    return [at, Math.round(from + (first + 2 * laid + 1) * piece) - at] as const;
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

/**
 * The pair of narrow bars a gemel is drawn as, in the room one band would have
 * taken: three parts bar, two parts field, three parts bar.
 *
 * The gap inside the pair is narrower than the field left around it, which is
 * what makes the two read as one charge rather than as two bars that happen to
 * lie close together.
 */
const gemelBars = ([at, across]: Band): Shape => {
  const bar = Math.round((across * 3) / 8);
  return all([rect(0, at, WIDTH, bar), rect(0, at + across - bar, WIDTH, bar)]);
};

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

/** How far a bordure reaches in from the edge: an eighth of the field, as armorials draw it. */
const BORDURE = WIDTH / 8;

/**
 * The band a bordure lays round the whole edge of the shield.
 *
 * It is the shield's own outline drawn as a thick stroke, which the clip path
 * then halves: a stroke straddles the line it follows, so the half outside the
 * shield is cut away and what is left is a band of the asked-for width lying
 * inside the edge — and following it round the curve of the base, which nothing
 * built out of rectangles would do.
 */
const bordureBand: Shape = (fill) =>
  `<path d="${SHIELD}" fill="none" stroke="${fill}" stroke-width="${BORDURE * 2}"/>`;

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
  // A gemel takes the room of a fess and spends it on two bars, so three of them
  // sit where three fesses would and are drawn as six.
  [OrdinaryType.barGemel]: (count) => all(bands(count, 0, HEIGHT).map(gemelBars)),
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
  // The bordure crosses the field nowhere: it follows the edge, and a shield has
  // one edge, so there is nothing for a count to narrow or space out.
  [OrdinaryType.bordure]: () => bordureBand,
};

/**
 * The room the charges share: a box well inside the shield, clear of the edges
 * on every side and of the point at the base.
 *
 * A charge is not measured against a line the way a band is, so nothing decides
 * its place but the room left for it. The box is the same whatever is borne, and
 * the charges are fitted into it: what a count changes is how small they are
 * drawn, exactly as it changes how narrow a band is drawn.
 */
const CHARGES_FROM_X = 26;
const CHARGES_TO_X = 174;
const CHARGES_FROM_Y = 24;
const CHARGES_TO_Y = 196;

/** How many charges stand side by side, at most. */
const ABREAST = 2;

/**
 * How big a single charge is drawn, whatever room it has.
 *
 * A lone charge fills the shield the way a band does — about a third of it —
 * rather than swelling to whatever box it was given. What multiplies it shrinks
 * it; nothing enlarges it.
 */
const CHARGE = 88;

/** How much of the room it is given a charge actually takes, leaving the rest around it. */
const OF_ITS_ROOM = 0.66;

/** A billet is a rectangle standing on end, half as wide as it is tall. */
const BILLET_WIDE = 0.5;

/** A lozenge is a diamond standing on end, and stands a little less narrow. */
const LOZENGE_WIDE = 0.75;

/** An annulet is a ring: what it encloses is the field, not its own tincture. */
const ANNULET_BAND = 0.22;

/** Where one charge stands, and how big it is drawn there. */
type Spot = {
  readonly x: number;
  readonly y: number;
  readonly size: number;
};

/**
 * How many charges stand in each rank, from chief to base.
 *
 * Two abreast, the odd one last — which is what heraldry does when a blazon
 * names a number and no disposition: three are two in chief and one in base, and
 * six are three ranks of two. Where an armorial would have laid five out two,
 * one and two, this lays them two, two and one, which is a stand-in and is
 * blazoned no differently until dispositions are read.
 */
function ranks(count: number): readonly number[] {
  const rows = Math.ceil(count / ABREAST);
  return Array.from({ length: rows }, (_, row) => Math.min(ABREAST, count - row * ABREAST));
}

/**
 * Where a given number of charges stand in the room they share.
 *
 * The ranks share the height between them and each charge its rank's share of
 * the width, every charge taking the same part of its own cell so that all of
 * them are drawn alike however many there are. A rank of one is centred, which
 * is what puts the odd charge under the pair above it.
 */
function spots(count: number): readonly Spot[] {
  const rows = ranks(count);
  const cell = (CHARGES_TO_X - CHARGES_FROM_X) / Math.min(count, ABREAST);
  const rank = (CHARGES_TO_Y - CHARGES_FROM_Y) / rows.length;
  const size = Math.round(Math.min(CHARGE, cell * OF_ITS_ROOM, rank * OF_ITS_ROOM));

  return rows.flatMap((abreast, row) => {
    const y = Math.round(CHARGES_FROM_Y + (row + 0.5) * rank);
    return Array.from({ length: abreast }, (_, along) => ({
      x: Math.round(WIDTH / 2 + (along - (abreast - 1) / 2) * cell),
      y,
      size,
    }));
  });
}

/**
 * The shape each charge is drawn as, at the place and the size it was given.
 *
 * Being keyed on ChargeType, a charge added to the vocabulary breaks this until
 * it is given a shape.
 */
const CHARGES: Record<ChargeType, (spot: Spot) => Shape> = {
  [ChargeType.annulet]: ({ x, y, size }) => {
    const band = Math.round(size * ANNULET_BAND);
    const radius = (size - band) / 2;
    return (fill) =>
      `<circle cx="${x}" cy="${y}" r="${radius}" fill="none" stroke="${fill}" stroke-width="${band}"/>`;
  },
  [ChargeType.billet]: ({ x, y, size }) => {
    const across = Math.round(size * BILLET_WIDE);
    return rect(x - Math.round(across / 2), y - Math.round(size / 2), across, size);
  },
  [ChargeType.lozenge]: ({ x, y, size }) => {
    const across = Math.round((size * LOZENGE_WIDE) / 2);
    const tall = Math.round(size / 2);
    return polygon(`${x},${y - tall} ${x + across},${y} ${x},${y + tall} ${x - across},${y}`);
  },
};

/**
 * A pile: a long triangle driven into the field from one edge, point first.
 *
 * Those from the chief have their base on the top edge and their point at the
 * base of the shield; those from the base are the same triangle turned over, and
 * the two ranks driven into each other are what a pily field is.
 */
const pileFromBase = ([at, across]: Band): Shape =>
  polygon(`${at},${HEIGHT} ${at + Math.round(across / 2)},0 ${at + across},${HEIGHT}`);

/**
 * The pieces a pily field lays over the piles from the chief.
 *
 * The piles from the chief share the top edge between them, so many as it takes
 * to leave every other piece for the ones driven the other way, and those are
 * the ones laid over: their points stand where two piles from the chief meet,
 * and their bases fill the base between the points of those two.
 *
 * An odd count leaves whole piles at both flanks, which is the shape a pily
 * falls into naturally and why its pieces are counted odd as readily as even. An
 * even count spends the odd one on a half pile at sinister.
 */
const pilesFromBase = (pieces: number): readonly Band[] => {
  const fromChief = Math.ceil(pieces / 2);
  const across = (SHIELD_SINISTER - SHIELD_DEXTER) / fromChief;
  return Array.from({ length: pieces - fromChief }, (_, pile) => {
    const point = Math.round(SHIELD_DEXTER + (pile + 1) * across);
    const at = Math.round(point - across / 2);
    return [at, Math.round(point + across / 2) - at] as const;
  });
};

/**
 * The pieces each varied field lays over itself, given how many it is cut into.
 *
 * Every one is drawn past the edges it meets and left to the clip path, as the
 * ordinaries are. Being keyed on VariationType, a varied field added to the
 * vocabulary breaks this until it is given a shape.
 */
const VARIATIONS: Record<VariationType, (pieces: number) => Shape> = {
  [VariationType.barry]: (pieces) =>
    all(
      alternate(pieces, SHIELD_TOP, SHIELD_BASE - SHIELD_TOP).map(([at, across]) =>
        rect(0, at, WIDTH, across)
      )
    ),
  [VariationType.paly]: (pieces) =>
    all(
      alternate(pieces, SHIELD_DEXTER, SHIELD_SINISTER - SHIELD_DEXTER).map(([at, across]) =>
        rect(at, 0, across, HEIGHT)
      )
    ),
  // The diagonals are counted from the corner in sinister chief down towards the
  // one in dexter base, which is where the armorials start them: "Bandé de
  // gueules et d'argent de six pièces" puts the gules in that corner, and so
  // does "Bandé d'or et d'azur" the or. Which tincture the dexter chief corner
  // falls to is then the count's to decide rather than the rule's, and the two
  // armorials differ on it — the one has the first tincture there and the other
  // the second, both being drawn in six.
  //
  // Counting from that end is counting the other way round, so it is the first
  // piece that is laid over rather than the second.
  [VariationType.bendy]: (pieces) =>
    all(alternate(pieces, SHIELD_BEND_FROM, SHIELD_BEND_TO - SHIELD_BEND_FROM, 0).map(bendBand)),
  [VariationType.pily]: (pieces) => all(pilesFromBase(pieces).map(pileFromBase)),
  // A chevron reaches as far below its point as the field is wide either side of
  // it, so the points run from a rise above the top of the shield to its foot,
  // and the pieces share that room rather than the height alone.
  [VariationType.chevronny]: (pieces) =>
    all(alternate(pieces, SHIELD_TOP - RISE, SHIELD_BASE - SHIELD_TOP + RISE).map(chevronBand)),
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

  /**
   * The field first, then whatever it bears: an ordinary is laid over, not under.
   *
   * Several are painted in the order the blazon named them, each over the last,
   * which is what that order is for — a bordure blazoned after three bends
   * covers where they meet the edge, and blazoned before them is covered by
   * them. A band and a charge answer to the same order: a bend blazoned after a
   * billet is drawn over the billet, and before it is drawn under.
   */
  private paintArms(blazon: Blazon, colours: ColorModel): string {
    const field = this.paintField(blazon.field, colours);
    const borne = (blazon.chargesOrOrdinaries ?? []).map((one) => paintBorne(one, colours));
    return field + borne.join('');
  }

  private paintField(field: Field, colours: ColorModel): string {
    if (isVariation(field)) {
      return paintVariation(field, colours);
    }
    // A pelt covers the whole field rather than cutting it, so there is nothing
    // to lay over anything: the shield is painted with the fur and is done.
    if (isFurred(field)) {
      return `<path d="${SHIELD}" fill="${escapeAttribute(cutFor(field, colours).fill)}"/>`;
    }
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

/**
 * The whole field in the first tincture, and every other piece of it laid over in
 * the second. The first piece is therefore the first tincture's, which is where
 * the armorials put it: in chief, or against the dexter chief corner.
 */
function paintVariation(variation: Variation, colours: ColorModel): string {
  return (
    `<path d="${SHIELD}" fill="${colourOf(colours, variation.firstTincture)}"/>` +
    VARIATIONS[variation.type](variation.pieces)(colourOf(colours, variation.secondTincture))
  );
}

/**
 * The fur a furred field is covered with, cut from the two tinctures it names.
 *
 * It is asked for twice over — once for the fill and once for the definition
 * that fill refers to — so the cutting answers the same for the same pair, and
 * the drawing carries one definition however often it is asked.
 */
function cutFor(field: Furred, colours: ColorModel): Pattern {
  return colours.cut(field.type, field.firstTincture, field.secondTincture);
}

/** Whichever it is, painted where its own vocabulary puts it. */
function paintBorne(one: ChargeOrOrdinary, colours: ColorModel): string {
  return isOrdinary(one) ? paintOrdinary(one, colours) : paintCharge(one, colours);
}

function paintOrdinary(ordinary: Ordinary, colours: ColorModel): string {
  return ORDINARIES[ordinary.type](borne(ordinary))(colourOf(colours, ordinary.tincture));
}

/**
 * Every one of a charge in the one tincture: three billets are three shapes of
 * one paint, as three bends are three bands of one.
 */
function paintCharge(charge: Charge, colours: ColorModel): string {
  const drawn = CHARGES[charge.type];
  return all(spots(numberBorne(charge)).map(drawn))(colourOf(colours, charge.tincture));
}

function colourOf(colours: ColorModel, tincture: Tincture): string {
  const paint = colours[tincture];
  return escapeAttribute(isPattern(paint) ? paint.fill : paint);
}

function tincturesOf(blazon: Blazon): readonly Tincture[] {
  const painted = blazon.field;
  const field =
    isDivision(painted) || isVariation(painted) || isFurred(painted)
      ? [painted.firstTincture, painted.secondTincture]
      : [painted.tincture];
  return [...field, ...(blazon.chargesOrOrdinaries ?? []).map(({ tincture }) => tincture)];
}

/**
 * The definitions the blazon's own tinctures call for, and no others — a shield
 * carries the patterns it is painted with, not every pattern that exists. An
 * ordinary counts among them, and so does a charge: both are painted with a
 * tincture like anything else.
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
  // A fur cut from two tinctures is a pattern no tincture of the blazon names,
  // and it is filled with the two that are named, whose own definitions the loop
  // above has already placed.
  if (isFurred(blazon.field)) {
    const cut = cutFor(blazon.field, colours);
    definitions.set(cut.fill, cut.definition);
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
