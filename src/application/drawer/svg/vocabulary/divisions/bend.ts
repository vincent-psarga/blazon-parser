import { polygon } from '../../shapes/polygon';
import { DivisionFigure } from '../Figures';

/**
 * The field cut from dexter chief to sinister base. The half in chief is the
 * triangle on the far side of the line from where it starts, being the one that
 * reaches the top of the field.
 */
export const bend: DivisionFigure = {
  halves: ({ width, height }) => [
    polygon(`0,0 ${width},0 ${width},${height}`),
    polygon(`0,0 ${width},${height} 0,${height}`),
  ],
};
