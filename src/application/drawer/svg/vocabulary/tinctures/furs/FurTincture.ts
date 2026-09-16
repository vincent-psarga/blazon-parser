import { Tincture } from '../../../../../../domain/models/Tinctures';
import { FurredFigure } from '../../Figures';

/**
 * A fur that is a tincture in its own right, which is a pelt whose pair is
 * settled rather than blazoned: vair says argent and azure by being vair.
 */
export type FurTincture = {
  /** The pelt it is drawn as, which some field may be covered with too. */
  readonly pelt: FurredFigure;
  /** The pair it is cut from: the ground first, the figure second. */
  readonly from: readonly [Tincture, Tincture];
  /**
   * Whether the figure is a mark rather than a tincture.
   *
   * An ermine spot is drawn the way a colouring draws its lines — solid, where
   * the colouring rules in lines — because a spot six units tall filled with
   * hatching ten units wide reads as a smudge. A vair bell is no mark but a
   * field of its own tincture, and is filled with it.
   */
  readonly inked?: boolean;
};
