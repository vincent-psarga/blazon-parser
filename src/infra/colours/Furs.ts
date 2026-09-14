import { Pattern } from '../../domain/services/IBlazonDrawer';

/**
 * The furs are pelts rather than paints, so each is a figure repeated over the
 * field: ermine is a metal strewn with spots, vair a lattice of bells in two
 * tinctures, set in rows that alternate and invert.
 *
 * Both are built here from whichever two tinctures the caller paints them with,
 * so that the same shapes serve a coloured drawing and a hatched one.
 */

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
      `<pattern id="${id}" width="${ERMINE_TILE}" height="${ERMINE_TILE}" patternUnits="userSpaceOnUse">` +
      `<rect width="${ERMINE_TILE}" height="${ERMINE_TILE}" fill="${field}"/>` +
      `<g fill="${spots}">` +
      `<g transform="translate(6 7)">${SPOT}</g>` +
      `<g transform="translate(18 19)">${SPOT}</g>` +
      `</g></pattern>`,
  };
}

const BELL = 20;
const ROW = 17;

/**
 * A row of vair bells: flat along the top, shoulders falling straight, and a
 * rounded base. A row is of one tincture throughout, so its bells run together
 * into a band; it is the scalloped edge between the bands that shows them.
 */
function row(width: number): string {
  const shoulder = ROW * 0.5;
  let path = `M0 0 H${width}`;
  for (let x = width; x > 0; x -= BELL) {
    path +=
      ` V${shoulder}` +
      ` C${x} ${ROW} ${x - BELL * 0.3} ${ROW} ${x - BELL / 2} ${ROW}` +
      ` C${x - BELL * 0.7} ${ROW} ${x - BELL} ${ROW} ${x - BELL} ${shoulder}`;
  }
  return `<path d="${path} Z"/>`;
}

export function vair(id: string, metal: string, colour: string, edge?: string): Pattern {
  const width = BELL * 2;
  const outline = edge === undefined ? '' : ` stroke="${edge}" stroke-width="0.7"`;
  return {
    fill: `url(#${id})`,
    definition:
      `<pattern id="${id}" width="${width}" height="${ROW * 2}" patternUnits="userSpaceOnUse">` +
      `<rect width="${width}" height="${ROW * 2}" fill="${metal}"/>` +
      `<g fill="${colour}"${outline}>${row(width)}</g>` +
      `</pattern>`,
  };
}
