import { Shape, swelling } from './Shape';

/**
 * A shape with its middle taken out: the band between two outlines painted, and
 * whatever lay under it showing through the hole.
 *
 * The two outlines are painted as one path under the even-odd rule, which opens
 * the middle whichever way round either was drawn. Winding would open it too,
 * but only if the inner outline were written backwards — a thing every figure
 * would then have to remember about itself, and get right.
 *
 * It is a hole and not a second paint: nothing is drawn in the middle, so what
 * shows is the field, which is what makes a voided charge one charge rather than
 * two laid one upon the other.
 */
export const hollow =
  (outer: string, inner: string): Shape =>
  (brush) =>
    `<path d="${outer} ${inner}" fill="${brush.fill}" fill-rule="evenodd"${swelling(brush)}/>`;
