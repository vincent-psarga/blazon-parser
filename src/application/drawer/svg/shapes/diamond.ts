import { Shape } from './Shape';
import { hollow } from './hollow';
import { polygon } from './polygon';

/** A diamond standing on one of its points, about a centre. */
export const diamond = (x: number, y: number, across: number, tall: number): Shape =>
  polygon(`${x},${y - tall} ${x + across},${y} ${x},${y + tall} ${x - across},${y}`);

/** The outline of such a diamond, written as a path so it can enclose another. */
const outline = (x: number, y: number, across: number, tall: number): string =>
  `M ${x} ${y - tall} L ${x + across} ${y} L ${x} ${y + tall} L ${x - across} ${y} Z`;

/**
 * The same diamond with its middle out, the band an even thickness all the way
 * round.
 *
 * A smaller diamond drawn inside a larger one leaves a band of even thickness
 * only if it is the larger one shrunk towards the centre — the two then have
 * parallel sides — so what is reckoned here is how far to shrink it. The centre
 * stands the same distance from every side, which the sides themselves give:
 * across and tall are the legs of the right triangle each side is the hypotenuse
 * of, and the distance is the height dropped onto it.
 */
export const hollowDiamond = (
  x: number,
  y: number,
  across: number,
  tall: number,
  band: number
): Shape => {
  const reach = (across * tall) / Math.hypot(across, tall);
  const left = Math.max(0, 1 - band / reach);
  return hollow(
    outline(x, y, across, tall),
    outline(x, y, Math.round(across * left), Math.round(tall * left))
  );
};
