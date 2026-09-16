import { Shape } from './Shape';

/** A path filled: the whole of whatever it encloses. */
export const filled =
  (path: string): Shape =>
  (fill) =>
    `<path d="${path}" fill="${fill}"/>`;

/**
 * A path drawn as a thick line rather than filled.
 *
 * A stroke straddles the line it follows, so half of one drawn along the edge of
 * a frame falls outside it and is clipped away: what is left is a band of half
 * the asked-for width lying inside the edge, and following it round whatever
 * curve it has — which nothing built out of rectangles would do.
 */
export const stroked =
  (path: string, width: number): Shape =>
  (fill) =>
    `<path d="${path}" fill="none" stroke="${fill}" stroke-width="${width}"/>`;
