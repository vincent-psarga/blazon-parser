import { Modifier } from '../../../../../domain/models/Modifier';
import { spaced } from '../../painting/arrange';
import { across, acrossIndented } from '../../shapes/bands';
import { OrdinaryFigure } from '../Figures';

/** A band straight across the middle, a third of the shield. */
export const fess: OrdinaryFigure = {
  shapes: (frame, count) => spaced(count, 0, frame.height).map(across(frame)),
  // The band the armorials indent oftenest, and the same band still: it lies
  // where the plain fess lay and keeps its width, its two edges cut into teeth.
  modified: {
    [Modifier.indented]: {
      shapes: (frame, count) => spaced(count, 0, frame.height).map(acrossIndented(frame)),
    },
  },
};
