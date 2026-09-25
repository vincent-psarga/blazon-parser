import { Modifier } from '../../../../../domain/models/Modifier';
import { spaced } from '../../painting/arrange';
import { inBendSinister, inBendSinisterIndented } from '../../shapes/bands';
import { OrdinaryFigure } from '../Figures';
import { DIAGONALS } from './bend';

/** The mirror of a bend, from sinister chief. */
export const bendSinister: OrdinaryFigure = {
  shapes: (frame, count) => spaced(count, -DIAGONALS / 2, DIAGONALS).map(inBendSinister(frame)),
  modified: {
    [Modifier.indented]: {
      shapes: (frame, count) =>
        spaced(count, -DIAGONALS / 2, DIAGONALS).map(inBendSinisterIndented(frame)),
    },
  },
};
