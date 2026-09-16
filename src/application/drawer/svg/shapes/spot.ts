import { Shape } from './Shape';

/** An ermine spot: a dart under three dots, drawn about the origin. */
const SPOT =
  '<path d="M0 -1.6 C-0.9 1.2 -3 3 -3 4.4 C-3 5.6 -1.6 6.3 0 6.3' +
  ' C1.6 6.3 3 5.6 3 4.4 C3 3 0.9 1.2 0 -1.6 Z"/>' +
  '<circle cx="0" cy="-4.2" r="0.85"/>' +
  '<circle cx="-1.7" cy="-2.7" r="0.85"/>' +
  '<circle cx="1.7" cy="-2.7" r="0.85"/>';

/** How far apart the spots stand: the side of the tile that repeats them. */
export const SPOTS = 24;

/**
 * The two spots one tile carries, the second set half a tile along both ways, so
 * that the rows fall between one another rather than under.
 */
export const spots: Shape = (fill) =>
  `<g fill="${fill}">` +
  `<g transform="translate(6 7)">${SPOT}</g>` +
  `<g transform="translate(18 19)">${SPOT}</g>` +
  `</g>`;
