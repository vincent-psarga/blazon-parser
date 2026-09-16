import { polygon } from '../../shapes/polygon';
import { DivisionFigure } from '../Figures';

/** The mirror of a bend, cut from sinister chief. */
export const bendSinister: DivisionFigure = {
  halves: ({ width, height }) => [
    polygon(`${width},0 0,0 0,${height}`),
    polygon(`${width},0 0,${height} ${width},${height}`),
  ],
};
