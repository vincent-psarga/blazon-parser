import { Shape } from './Shape';
import { hollow } from './hollow';

export const rectangle =
  (x: number, y: number, width: number, height: number): Shape =>
  (fill) =>
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`;

/** The outline of such a rectangle, written as a path so it can enclose another. */
const outline = (x: number, y: number, width: number, height: number): string =>
  `M ${x} ${y} H ${x + width} V ${y + height} H ${x} Z`;

/**
 * The same rectangle with its middle out, the band an even thickness all the way
 * round: the corners are square, so the inner outline is simply the outer one
 * brought in by the band on every side.
 */
export const hollowRectangle = (
  x: number,
  y: number,
  width: number,
  height: number,
  band: number
): Shape =>
  hollow(
    outline(x, y, width, height),
    outline(x + band, y + band, Math.max(0, width - 2 * band), Math.max(0, height - 2 * band))
  );
