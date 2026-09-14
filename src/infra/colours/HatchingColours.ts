import { Colours, Metals } from '../../domain/models/Tinctures';
import { ColorModel, Pattern } from '../../domain/services/IBlazonDrawer';

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

export const HatchingColours: ColorModel = {
  // Argent carries no marks at all: in this system the paper is the metal.
  [Metals.argent]: PAPER,
  [Metals.or]: hatch('or', DOTS),
  [Colours.azure]: hatch('azure', HORIZONTAL),
  [Colours.gules]: hatch('gules', VERTICAL),
  [Colours.sable]: hatch('sable', HORIZONTAL + VERTICAL),
  // Ruled lines turned onto the diagonal a bend runs along.
  [Colours.vert]: hatch('vert', HORIZONTAL, ' patternTransform="rotate(45)"'),
};
