import { Shape, swelling } from './Shape';

/**
 * A filled circle: what a ring would be if it were painted through rather than
 * drawn as a line.
 */
export const disc =
  (x: number, y: number, radius: number): Shape =>
  (brush) =>
    `<circle cx="${x}" cy="${y}" r="${radius}" fill="${brush.fill}"${swelling(brush)}/>`;

/**
 * The outline of such a circle, written as a path so it can be a hole in
 * another shape.
 *
 * Two half-turns rather than one whole one: an arc that ended where it began
 * would name no arc at all, SVG having no way to tell a full circle from an
 * empty one, so the circle is drawn side to side and back again.
 */
export const circleOutline = (x: number, y: number, radius: number): string =>
  `M ${x - radius} ${y} A ${radius} ${radius} 0 1 0 ${x + radius} ${y} A ${radius} ${radius} 0 1 0 ${x - radius} ${y} Z`;
