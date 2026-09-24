import { Brush, Shape, swelling, swollenBy } from './Shape';

/** A path filled: the whole of whatever it encloses. */
export const filled =
  (path: string): Shape =>
  (brush) =>
    `<path d="${path}" fill="${brush.fill}"${swelling(brush)}/>`;

/**
 * A path drawn about its own origin in a box one unit across, put where it
 * belongs and drawn that many units tall.
 *
 * A figure whose shape is its own — a drop, a lily — is written once at a size
 * that can be read and argued with, and placed by scaling its numbers rather
 * than by wrapping it in a transform. A transform would scale what fills the
 * shape along with the shape, and a figure filled with hatching would have its
 * ruling blown up until the whole figure was one stripe of it.
 *
 * Only M, L, C and Z are written in such a path, and every number in them is a
 * coordinate — x first, y second, over and over, each command taking an even
 * number of them — so placing the figure is counting them.
 */
export const placed = (path: string, x: number, y: number, size: number): Shape => {
  let along = 0;
  return filled(
    path.replace(/-?\d*\.?\d+/g, (number) => {
      const placed = Number(number) * size + (along % 2 === 0 ? x : y);
      along += 1;
      // Tenths: finer than any shield is drawn, and short enough to read.
      return `${Math.round(placed * 10) / 10}`;
    })
  );
};

/**
 * A path drawn as a thick line rather than filled.
 *
 * A stroke straddles the line it follows, so half of one drawn along the edge of
 * a frame falls outside it and is clipped away: what is left is a band of half
 * the asked-for width lying inside the edge, and following it round whatever
 * curve it has — which nothing built out of rectangles would do.
 *
 * A band has no inside for a fill to cover an outline back to, so it is not
 * swollen by a second stroke but drawn the wider by one: the fill laid over it
 * afterwards leaves exactly the two lines either side of the band.
 */
export const stroked =
  (path: string, width: number): Shape =>
  (brush: Brush) =>
    `<path d="${path}" fill="none" stroke="${brush.fill}" stroke-width="${swollenBy(width, brush)}"/>`;
