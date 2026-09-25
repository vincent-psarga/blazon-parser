import { Brush, Shape, swollenBy } from './Shape';

/**
 * A ring: a circle drawn as a line rather than filled, so what it encloses is
 * whatever was under it rather than its own paint.
 *
 * Being a line and not a filled shape, it is outlined the way a band is: drawn
 * wider rather than swollen by a stroke, so that the fill over it leaves a line
 * either side of the ring.
 */
export const ring =
  (x: number, y: number, radius: number, band: number): Shape =>
  (brush: Brush) =>
    `<circle cx="${x}" cy="${y}" r="${radius}" fill="none" stroke="${brush.fill}" stroke-width="${swollenBy(band, brush)}"/>`;
