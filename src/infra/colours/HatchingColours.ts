import { Colours, Furs, Metals } from '../../domain/models/Tinctures';
import { Tincture } from '../../domain/models/Tinctures';
import { ColorModel, Paint, Pattern } from '../../domain/services/IBlazonDrawer';
import { cutFurs, ermine, vair } from './Furs';

/**
 * Hatching: the convention for standing in for the tinctures where colour cannot
 * be had — engravings, seals, coins. The marks follow the table at
 * https://en.wikipedia.org/wiki/Hatching_(heraldry), where argent is simply left
 * blank, or is dotted, azure is ruled horizontally, gules vertically, sable both
 * ways at once, and vert diagonally from dexter chief to sinister base.
 */
const PAPER = '#ffffff';
const INK = '#111111';

// Wide enough that the marks stay apart on a shield an inch across.
const TILE = 10;
const STROKE = 1.2;

const HORIZONTAL = `<path d="M0 ${TILE / 2} H${TILE}" stroke="${INK}" stroke-width="${STROKE}"/>`;
const VERTICAL = `<path d="M${TILE / 2} 0 V${TILE}" stroke="${INK}" stroke-width="${STROKE}"/>`;
const DOTS =
  `<circle cx="${TILE / 4}" cy="${TILE / 4}" r="1.3" fill="${INK}"/>` +
  `<circle cx="${(TILE * 3) / 4}" cy="${(TILE * 3) / 4}" r="1.3" fill="${INK}"/>`;

function hatch(name: string, marks: string, transform = ''): Pattern {
  const id = `hatch-${name}`;
  return {
    fill: `url(#${id})`,
    definition:
      `<pattern id="${id}" width="${TILE}" height="${TILE}" patternUnits="userSpaceOnUse"${transform}>` +
      `<rect width="${TILE}" height="${TILE}" fill="${PAPER}"/>${marks}</pattern>`,
  };
}

/**
 * What this colouring names its patterns after. Ids are shared across a whole
 * page rather than owned by one drawing, so a shield shown hatched beside the
 * same shield in colour would otherwise ask for one definition and get the
 * other's, whichever the page had placed first.
 */
const COLOURING = 'hatched';

const TINCTURES: Record<Tincture, Paint> = {
  // Argent carries no marks at all: in this system the paper is the metal.
  [Metals.argent]: PAPER,
  [Metals.or]: hatch('or', DOTS),
  [Colours.azure]: hatch('azure', HORIZONTAL),
  [Colours.gules]: hatch('gules', VERTICAL),
  [Colours.sable]: hatch('sable', HORIZONTAL + VERTICAL),
  // Ruled lines turned onto the diagonal a bend runs along.
  [Colours.vert]: hatch('vert', HORIZONTAL, ' patternTransform="rotate(45)"'),
  // Ermine is blank paper and solid spots, both of which hatching already has.
  [Furs.ermine]: ermine(`ermine-${COLOURING}`, PAPER, INK),
  // Vair needs its azure ruled, so it carries the ruling it refers to with it.
  [Furs.vair]: vairHatched(),
};

/**
 * Every tincture here is ruling or blank paper, so a vairé cut from two of them
 * would be one mark against another with nothing between: the bells are given an
 * edge, as the vair's own are.
 */
export const HatchingColours: ColorModel = {
  ...TINCTURES,
  cut: cutFurs(COLOURING, TINCTURES, INK),
};

/**
 * A pattern may carry more than one definition, so vair brings along the ruling
 * its bells are filled with. The ruling is given a name of its own rather than
 * sharing azure's, since a shield bearing both would otherwise define it twice.
 */
function vairHatched(): Pattern {
  const ruling = hatch('vair-azure', HORIZONTAL);
  const bells = vair(`vair-${COLOURING}`, PAPER, ruling.fill, INK);
  return { fill: bells.fill, definition: ruling.definition + bells.definition };
}
