import { Shape } from './Shape';

/**
 * A ring: a circle drawn as a line rather than filled, so what it encloses is
 * whatever was under it rather than its own paint.
 */
export const ring =
  (x: number, y: number, radius: number, band: number): Shape =>
  (fill) =>
    `<circle cx="${x}" cy="${y}" r="${radius}" fill="none" stroke="${fill}" stroke-width="${band}"/>`;
