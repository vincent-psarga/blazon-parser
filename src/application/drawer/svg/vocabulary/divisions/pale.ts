import { rectangle } from '../../shapes/rectangle';
import { DivisionFigure } from '../Figures';

/** The field cut straight down the middle: the half at dexter first. */
export const pale: DivisionFigure = {
  halves: ({ width, height }) => [
    rectangle(0, 0, width / 2, height),
    rectangle(width / 2, 0, width / 2, height),
  ],
};
