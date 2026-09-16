import { alternate } from '../../painting/arrange';
import { inBend } from '../../shapes/bands';
import { VariationFigure } from '../Figures';

/**
 * The bend repeated: a row of stripes corner to corner.
 *
 * The diagonals are counted from the corner in sinister chief down towards the
 * one in dexter base, which is where the armorials start them: "Bandé de gueules
 * et d'argent de six pièces" puts the gules in that corner, and so does "Bandé
 * d'or et d'azur" the or. Which tincture the dexter chief corner falls to is then
 * the count's to decide rather than the rule's, and the two armorials differ on
 * it — the one has the first tincture there and the other the second, both being
 * drawn in six.
 *
 * Counting from that end is counting the other way round, so it is the first
 * piece that is laid over rather than the second.
 */
export const bendy: VariationFigure = {
  pieces: (frame, pieces) =>
    alternate(pieces, frame.bendFrom, frame.bendTo - frame.bendFrom, 0).map(inBend(frame)),
};
