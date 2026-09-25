import { Modifier } from '../../../../../domain/models/Modifier';
import { acrossIndented } from '../../shapes/bands';
import { rectangle } from '../../shapes/rectangle';
import { OrdinaryFigure } from '../Figures';

/** A chief takes a third of the shield, as every single band does. */
const DEEP = 80;

/**
 * The top of the shield itself rather than a band laid anywhere on it, which is
 * why there is one of them however many a blazon asks for.
 */
export const chief: OrdinaryFigure = {
  shapes: ({ width }) => [rectangle(0, 0, width, DEEP)],
  // The one band with a single free edge: its upper one is the top of the
  // shield, so the teeth cut there fall outside the outline and the clip path
  // takes them, which leaves the teeth along the base where a reader looks for
  // them.
  modified: {
    [Modifier.indented]: { shapes: (frame) => [acrossIndented(frame)([0, DEEP])] },
  },
};
