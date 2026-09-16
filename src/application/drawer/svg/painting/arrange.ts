import { Band } from '../shapes/bands';

/**
 * Where a given number of bands lie across the room they share.
 *
 * The room is cut into equal parts, one more part than there are bands twice
 * over, and the bands take every other part: a single band takes the middle
 * third, two take the second and fourth fifths, three the second, fourth and
 * sixth sevenths. That is what heraldry does when a field bears several of an
 * ordinary — the bands narrow to make room for each other, evenly, rather than
 * crowding to one side — and it leaves a single band exactly where it was drawn
 * before there could be two.
 *
 * It is the edges that are rounded rather than the width, so that neighbouring
 * bands keep whole numbers between them.
 */
export function spaced(count: number, from: number, extent: number): readonly Band[] {
  const part = extent / (2 * count + 1);
  return Array.from({ length: count }, (_, band) => {
    const at = Math.round(from + (2 * band + 1) * part);
    return [at, Math.round(from + (2 * band + 2) * part) - at] as const;
  });
}

/**
 * Where the pieces of a field cut over and over lie that are laid over it.
 *
 * Such a field is cut into equal pieces of two tinctures laid alternately, so it
 * is painted the first tincture entire and every other piece laid over it in the
 * second: half the shapes, and no seam anywhere between two pieces of the one
 * tincture.
 *
 * The pieces laid over are the second, the fourth and so on — save where a field
 * counts its pieces from the end this measures from, as the bendy does, and the
 * first, third and fifth are the ones to lay.
 *
 * It is the edges that are rounded rather than the width, so that neighbouring
 * pieces keep whole numbers between them.
 */
export function alternate(
  pieces: number,
  from: number,
  extent: number,
  first = 1
): readonly Band[] {
  const piece = extent / pieces;
  return Array.from({ length: Math.floor((pieces - first + 1) / 2) }, (_, laid) => {
    const at = Math.round(from + (first + 2 * laid) * piece);
    return [at, Math.round(from + (first + 2 * laid + 1) * piece) - at] as const;
  });
}
