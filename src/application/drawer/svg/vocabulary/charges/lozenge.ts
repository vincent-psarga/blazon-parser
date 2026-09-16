import { diamond } from '../../shapes/diamond';
import { BorneFigure } from '../Figures';
import { spots } from './disposition';

/** A lozenge is a diamond standing on end, and stands a little less narrow than a billet. */
const WIDE = 0.75;

/** A diamond standing on one of its points, taller than it is wide. */
export const lozenge: BorneFigure = {
  shapes: (frame, count) =>
    spots(frame, count).map(({ x, y, size }) =>
      diamond(x, y, Math.round((size * WIDE) / 2), Math.round(size / 2))
    ),
};
