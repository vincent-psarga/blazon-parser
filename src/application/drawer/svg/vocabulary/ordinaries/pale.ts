import { spaced } from '../../painting/arrange';
import { down } from '../../shapes/bands';
import { BorneFigure } from '../Figures';

/** A band straight down the middle, a third of the shield. */
export const pale: BorneFigure = {
  shapes: (frame, count) => spaced(count, 0, frame.width).map(down(frame)),
};
