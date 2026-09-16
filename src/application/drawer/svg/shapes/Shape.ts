/**
 * Geometry awaiting a paint.
 *
 * A shape knows where it is and nothing about what it is filled with, which is
 * what keeps this folder free of heraldry: the same rectangle is a fess, a
 * billet, or half a field divided per pale, and none of that is its business.
 */
export type Shape = (fill: string) => string;

/** Several shapes painted alike: a band that crosses itself, or repeats. */
export const all =
  (shapes: readonly Shape[]): Shape =>
  (fill) =>
    shapes.map((shape) => shape(fill)).join('');
