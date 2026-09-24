/**
 * What a shape is painted with, and how much of the page it is to take.
 *
 * A shape is outlined by being drawn twice: once in the ink of the line and
 * swollen past its own edges, and once filled over that, which covers it back
 * to them. What is left is a line round the outside. Two passes rather than a
 * stroke along the boundary, because the fills of everything painted alike go
 * over every swollen copy — so no line is left between two shapes that touch or
 * overlap, only round the figure they make together.
 */
export type Brush = {
  /** What the shape is painted with. */
  readonly fill: string;
  /** Whether this is that swollen copy rather than the fill laid over it. */
  readonly swollen?: boolean;
};

/**
 * Geometry awaiting a paint.
 *
 * A shape knows where it is and nothing about what it is filled with, which is
 * what keeps this folder free of heraldry: the same rectangle is a fess, a
 * billet, or half a field divided per pale, and none of that is its business.
 */
export type Shape = (brush: Brush) => string;

/**
 * How far a swollen shape stands outside its own edges, which is how wide the
 * line round it is drawn: heavier than the ruling it has to hold against, and
 * light enough not to eat a figure sown small.
 */
const EDGE = 1.4;

/**
 * What swells a filled shape: a stroke straddling its boundary, half of it
 * inside where the fill will cover it again and half outside where it stays.
 * Nothing at all where the brush is the fill.
 */
export const swelling = ({ fill, swollen }: Brush): string =>
  swollen === true ? ` stroke="${fill}" stroke-width="${2 * EDGE}"` : '';

/**
 * How wide a shape drawn as a thick line is drawn when it is swollen instead.
 *
 * Such a shape has no inside for a fill to cover a stroke back to, so it is
 * widened rather than stroked, and the fill over it at its own width leaves the
 * line on either side.
 */
export const swollenBy = (width: number, { swollen }: Brush): number =>
  swollen === true ? width + 2 * EDGE : width;

/** Several shapes painted alike: a band that crosses itself, or repeats. */
export const all =
  (shapes: readonly Shape[]): Shape =>
  (brush) =>
    shapes.map((shape) => shape(brush)).join('');
