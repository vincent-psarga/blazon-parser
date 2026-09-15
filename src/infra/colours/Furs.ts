import { FurType } from '../../domain/models/Field';
import { Tincture } from '../../domain/models/Tinctures';
import { FurCutting, Paint, Pattern, isPattern } from '../../domain/services/IBlazonDrawer';

/**
 * The furs are pelts rather than paints, so each is a figure repeated over the
 * field: ermine is a metal strewn with spots, vair a lattice of bells in two
 * tinctures, set in rows that alternate and invert.
 *
 * Both are built here from whichever two tinctures the caller paints them with,
 * so that the same shapes serve a coloured drawing and a hatched one.
 */

/**
 * Where the field begins, which is not where the drawing begins: a heater is
 * inset from the edges of the box it is drawn in, so a pelt reckoned from the
 * box has its first figures cut through by the shield's own edge — the points of
 * the topmost bells swallowed along the chief, and the flare of their bases along
 * dexter.
 *
 * The figures are therefore laid from the corner of the shield rather than the
 * corner of the drawing, which is where heraldry starts them: the chief row
 * shows its points, and the dexter column its whole width. It is the inset the
 * drawer draws the shield at.
 */
const CORNER = 6;

/** The tile placed at that corner rather than at the drawing's own. */
const FROM_CORNER = ` x="${CORNER}" y="${CORNER}"`;

// An ermine spot: a dart under three dots, drawn about the origin.
const SPOT =
  '<path d="M0 -1.6 C-0.9 1.2 -3 3 -3 4.4 C-3 5.6 -1.6 6.3 0 6.3' +
  ' C1.6 6.3 3 5.6 3 4.4 C3 3 0.9 1.2 0 -1.6 Z"/>' +
  '<circle cx="0" cy="-4.2" r="0.85"/>' +
  '<circle cx="-1.7" cy="-2.7" r="0.85"/>' +
  '<circle cx="1.7" cy="-2.7" r="0.85"/>';

const ERMINE_TILE = 24;

export function ermine(id: string, field: string, spots: string): Pattern {
  return {
    fill: `url(#${id})`,
    definition:
      `<pattern id="${id}"${FROM_CORNER} width="${ERMINE_TILE}" height="${ERMINE_TILE}" patternUnits="userSpaceOnUse">` +
      `<rect width="${ERMINE_TILE}" height="${ERMINE_TILE}" fill="${field}"/>` +
      `<g fill="${spots}">` +
      `<g transform="translate(6 7)">${SPOT}</g>` +
      `<g transform="translate(18 19)">${SPOT}</g>` +
      `</g></pattern>`,
  };
}

/**
 * A vair bell, drawn about a box four units wide and three and three fifths
 * tall: a point at the top, shoulders flaring out a unit, straight flanks, then
 * a second flare to a wide flat base. The shape is its own complement — turn it
 * about and it fits the gap between two of its fellows exactly — so a field of
 * bells of one tincture leaves behind a field of bells of the other, which is
 * what vair is. The proportions are Wikipedia's, at
 * https://commons.wikimedia.org/wiki/File:Vair_plain.svg
 */
const UNIT = 12.5;
const BELL_WIDTH = 4 * UNIT;
const BELL_HEIGHT = 3.6 * UNIT;
const SHOULDER = UNIT;
const WAIST = 2.6 * UNIT;

const BELL =
  `M${2 * UNIT} 0` +
  ` L${UNIT} ${SHOULDER} V${WAIST} L0 ${BELL_HEIGHT}` +
  ` H${4 * UNIT}` +
  ` L${3 * UNIT} ${WAIST} V${SHOULDER} Z`;

/**
 * Rows of bells, each row set half a bell across from the one above it so that
 * the points of one row meet the points of the next. The first tincture is laid
 * down whole and the second cut into bells over it, which puts the first along
 * the chief, as vair is always drawn; naming them first and second rather than
 * metal and colour leaves the way open for vairé, whose two tinctures answer to
 * no such rule.
 *
 * The bells of the lower row are drawn twice, half a bell either side of where
 * they belong, since the row straddles the edge of the tile.
 */
export function vair(id: string, first: string, second: string, edge?: string): Pattern {
  const outline = edge === undefined ? '' : ` stroke="${edge}" stroke-width="0.7"`;
  const offset = BELL_WIDTH / 2;
  return {
    fill: `url(#${id})`,
    definition:
      `<pattern id="${id}"${FROM_CORNER} width="${BELL_WIDTH}" height="${BELL_HEIGHT * 2}" patternUnits="userSpaceOnUse">` +
      `<rect width="${BELL_WIDTH}" height="${BELL_HEIGHT * 2}" fill="${first}"/>` +
      `<g fill="${second}"${outline}>` +
      `<path d="${BELL}"/>` +
      `<path d="${BELL}" transform="translate(${-offset} ${BELL_HEIGHT})"/>` +
      `<path d="${BELL}" transform="translate(${offset} ${BELL_HEIGHT})"/>` +
      `</g></pattern>`,
  };
}

/**
 * The bells, and whatever else a fur is drawn as, under the name of the fur.
 *
 * Being keyed on FurType, a fur added to the vocabulary breaks this until it is
 * given a shape. The furs that are tinctures rather than fields — ermine, vair —
 * are laid by the colourings themselves and are none of this table's business.
 */
const CUT: Record<FurType, (id: string, first: string, second: string, edge?: string) => Pattern> =
  {
    [FurType.vairy]: vair,
  };

/**
 * How a colouring cuts its furs from two tinctures which are not the fur's own.
 *
 * The shapes are the same shapes; what changes is what they are filled with, so
 * the colouring hands over its own table of tinctures and the fill is read off
 * that — a tincture painted with a pattern lends its pattern, whose definition
 * the drawing already carries for having named the tincture.
 *
 * The colouring gives its own name as well, because ids are shared across a
 * whole page rather than owned by one drawing: a shield shown in colour beside
 * the same shield hatched would otherwise ask for one definition and get the
 * other's, whichever the page had placed first.
 *
 * An edge is worth having wherever the two tinctures are themselves patterns:
 * ruling cut into bells against more ruling reads as neither without a line
 * between them.
 */
export function cutFurs(
  colouring: string,
  tinctures: Record<Tincture, Paint>,
  edge?: string
): FurCutting {
  const fill = (tincture: Tincture): string => {
    const paint = tinctures[tincture];
    return isPattern(paint) ? paint.fill : paint;
  };
  return (type, first, second) =>
    CUT[type](idOf(colouring, type, first, second), fill(first), fill(second), edge);
}

/**
 * A name for one fur cut from one pair of tinctures by one colouring. The terms
 * spell themselves — FurType.vairy, Metals.or — so the name is theirs with the
 * punctuation turned into something an id may hold, and two shields cut alike by
 * the same colouring share the one definition.
 */
function idOf(colouring: string, type: FurType, first: Tincture, second: Tincture): string {
  return [type, colouring, first, second].join('-').replace(/\./g, '-').toLowerCase();
}
