import { Shape } from './Shape';

/**
 * A vair bell, drawn about a box four units wide and three and three fifths
 * tall: a point at the top, shoulders flaring out a unit, straight flanks, then
 * a second flare to a wide flat base.
 *
 * The shape is its own complement — turn it about and it fits the gap between
 * two of its fellows exactly — so a field of bells of one tincture leaves behind
 * a field of bells of the other, which is what vair is. The proportions are
 * Wikipedia's, at https://commons.wikimedia.org/wiki/File:Vair_plain.svg
 */
const UNIT = 12.5;
const SHOULDER = UNIT;
const WAIST = 2.6 * UNIT;

export const BELL_WIDTH = 4 * UNIT;
export const BELL_HEIGHT = 3.6 * UNIT;

const BELL =
  `M${2 * UNIT} 0` +
  ` L${UNIT} ${SHOULDER} V${WAIST} L0 ${BELL_HEIGHT}` +
  ` H${4 * UNIT}` +
  ` L${3 * UNIT} ${WAIST} V${SHOULDER} Z`;

/**
 * The bells one tile carries: rows set half a bell across from one another so
 * that the points of one row meet the points of the next.
 *
 * The bells of the lower row are drawn twice, half a bell either side of where
 * they belong, since the row straddles the edge of the tile.
 *
 * An edge is worth having wherever the bells and their ground are marks rather
 * than colours: ruling cut into bells against more ruling reads as neither
 * without a line between them.
 */
export const bells =
  (edge?: string): Shape =>
  (fill) => {
    const outline = edge === undefined ? '' : ` stroke="${edge}" stroke-width="0.7"`;
    const offset = BELL_WIDTH / 2;
    return (
      `<g fill="${fill}"${outline}>` +
      `<path d="${BELL}"/>` +
      `<path d="${BELL}" transform="translate(${-offset} ${BELL_HEIGHT})"/>` +
      `<path d="${BELL}" transform="translate(${offset} ${BELL_HEIGHT})"/>` +
      `</g>`
    );
  };
