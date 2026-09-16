import { Frame } from '../../../Ground';
import { Band } from '../../../shapes/bands';
import { fromBase } from '../../../shapes/triangles';
import { VariationFigure } from '../../Figures';

/**
 * The pieces a pily field lays over the piles from the chief.
 *
 * The piles from the chief share the top edge between them, so many as it takes
 * to leave every other piece for the ones driven the other way, and those are
 * the ones laid over: their points stand where two piles from the chief meet,
 * and their bases fill the base between the points of those two.
 *
 * An odd count leaves whole piles at both flanks, which is the shape a pily falls
 * into naturally and why its pieces are counted odd as readily as even. An even
 * count spends the odd one on a half pile at sinister.
 */
function drivenFromBase(frame: Frame, pieces: number): readonly Band[] {
  const fromChief = Math.ceil(pieces / 2);
  const across = (frame.sinister - frame.dexter) / fromChief;
  return Array.from({ length: pieces - fromChief }, (_, pile) => {
    const point = Math.round(frame.dexter + (pile + 1) * across);
    const at = Math.round(point - across / 2);
    return [at, Math.round(point + across / 2) - at] as const;
  });
}

/** Two ranks of long triangles driven into each other, point first. */
export const pily: VariationFigure = {
  pieces: (frame, pieces) => drivenFromBase(frame, pieces).map(fromBase(frame)),
};
