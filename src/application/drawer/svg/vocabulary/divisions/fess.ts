import { rectangle } from '../../shapes/rectangle';
import { DivisionFigure } from '../Figures';

/** The field cut straight across the waist: the half in chief first. */
export const fess: DivisionFigure = {
  halves: ({ width, height }) => [
    rectangle(0, 0, width, height / 2),
    rectangle(0, height / 2, width, height / 2),
  ],
};
