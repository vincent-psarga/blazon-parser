import { Shape } from './Shape';

/**
 * A filled circle: what a ring would be if it were painted through rather than
 * drawn as a line.
 */
export const disc =
  (x: number, y: number, radius: number): Shape =>
  (fill) =>
    `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}"/>`;
