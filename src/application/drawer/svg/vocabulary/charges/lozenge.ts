import { diamond } from '../../shapes/diamond';
import { ChargeFigure } from '../Figures';
import { charge } from './Charge';

/** A lozenge is a diamond standing on end, and stands a little less narrow than a billet. */
const WIDE = 0.75;

/** A diamond standing on one of its points, taller than it is wide. */
export const lozenge: ChargeFigure = charge(({ x, y, size }) =>
  diamond(x, y, Math.round((size * WIDE) / 2), Math.round(size / 2))
);
