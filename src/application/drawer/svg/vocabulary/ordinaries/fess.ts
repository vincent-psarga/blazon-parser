import { spaced } from '../../painting/arrange';
import { across } from '../../shapes/bands';
import { BorneFigure } from '../Figures';

/** A band straight across the middle, a third of the shield. */
export const fess: BorneFigure = {
  shapes: (frame, count) => spaced(count, 0, frame.height).map(across(frame)),
};
