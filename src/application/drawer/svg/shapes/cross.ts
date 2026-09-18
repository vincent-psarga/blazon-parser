import { Shape } from './Shape';
import { hollow } from './hollow';
import { polygon } from './polygon';

/**
 * The twelve corners of a cross about a centre, in the order they are gone
 * round: the arm reaching so far from the middle, the limb so far across it.
 *
 * Twelve is what a cross is when nothing is rounded off, and the same twelve
 * serve the figure painted whole and the outline of one with its middle out.
 */
const corners = (x: number, y: number, arm: number, half: number): readonly string[] => [
  `${x - half},${y - arm}`,
  `${x + half},${y - arm}`,
  `${x + half},${y - half}`,
  `${x + arm},${y - half}`,
  `${x + arm},${y + half}`,
  `${x + half},${y + half}`,
  `${x + half},${y + arm}`,
  `${x - half},${y + arm}`,
  `${x - half},${y + half}`,
  `${x - arm},${y + half}`,
  `${x - arm},${y - half}`,
  `${x - half},${y - half}`,
];

/**
 * A cross of four equal arms about a centre, stopping short of anything: the
 * ordinary's own figure made small enough to be borne.
 */
export const cross = (x: number, y: number, size: number, band: number): Shape =>
  polygon(corners(x, y, size / 2, band / 2).join(' '));

/** The outline of such a cross, written as a path so it can enclose another. */
const outline = (x: number, y: number, arm: number, half: number): string =>
  `M ${corners(x, y, arm, half).join(' L ').replace(/,/g, ' ')} Z`;

/**
 * The same cross with its middle out, the band an even thickness all the way
 * round.
 *
 * Every side of a cross is square to its neighbours, as a rectangle's are, so
 * the inner outline is the outer one brought in by the band on every side —
 * which is the arms shortened and the limb narrowed by that same amount. A band
 * thicker than half the limb would close the figure, so the inner outline is
 * never let past the middle.
 */
export const hollowCross = (
  x: number,
  y: number,
  size: number,
  band: number,
  line: number
): Shape =>
  hollow(
    outline(x, y, size / 2, band / 2),
    outline(x, y, Math.max(0, size / 2 - line), Math.max(0, band / 2 - line))
  );
