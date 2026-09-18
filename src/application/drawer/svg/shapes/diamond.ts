import { Shape } from './Shape';
import { circleOutline } from './disc';
import { hollow } from './hollow';
import { polygon } from './polygon';

/** A diamond standing on one of its points, about a centre. */
export const diamond = (x: number, y: number, across: number, tall: number): Shape =>
  polygon(`${x},${y - tall} ${x + across},${y} ${x},${y + tall} ${x - across},${y}`);

/** The outline of such a diamond, written as a path so it can enclose another. */
const outline = (x: number, y: number, across: number, tall: number): string =>
  `M ${x} ${y - tall} L ${x + across} ${y} L ${x} ${y + tall} L ${x - across} ${y} Z`;

/**
 * How far the centre of such a diamond stands from the nearest point of its
 * outline, which is how much room there is inside it.
 *
 * The sides themselves give it: across and tall are the legs of the right
 * triangle each side is the hypotenuse of, and the distance is the height
 * dropped onto it. A band thicker than this closes the figure and a hole wider
 * than it bursts the sides, so both are reckoned off it.
 */
export const roomInDiamond = (across: number, tall: number): number =>
  (across * tall) / Math.hypot(across, tall);

/**
 * The same diamond with its middle out, the band an even thickness all the way
 * round.
 *
 * A smaller diamond drawn inside a larger one leaves a band of even thickness
 * only if it is the larger one shrunk towards the centre — the two then have
 * parallel sides — so what is reckoned here is how far to shrink it.
 */
export const hollowDiamond = (
  x: number,
  y: number,
  across: number,
  tall: number,
  band: number
): Shape => {
  const left = Math.max(0, 1 - band / roomInDiamond(across, tall));
  return hollow(
    outline(x, y, across, tall),
    outline(x, y, Math.round(across * left), Math.round(tall * left))
  );
};

/**
 * The same diamond with a round hole punched through the middle of it, the rest
 * of it left painted: the rustre, where the hollow one is the mascle.
 */
export const piercedDiamond = (
  x: number,
  y: number,
  across: number,
  tall: number,
  radius: number
): Shape => hollow(outline(x, y, across, tall), circleOutline(x, y, radius));
