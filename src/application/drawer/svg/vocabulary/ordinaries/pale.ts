import { Modifier } from '../../../../../domain/models/Modifier';
import { spaced } from '../../painting/arrange';
import { down, downIndented } from '../../shapes/bands';
import { OrdinaryFigure } from '../Figures';

/** A band straight down the middle, a third of the shield. */
export const pale: OrdinaryFigure = {
  shapes: (frame, count) => spaced(count, 0, frame.width).map(down(frame)),
  modified: {
    [Modifier.indented]: {
      shapes: (frame, count) => spaced(count, 0, frame.width).map(downIndented(frame)),
    },
  },
};
