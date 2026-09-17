import { cross } from '../../shapes/cross';
import { ChargeFigure } from '../Figures';
import { charge } from './Charge';

/** How much of the cross is arm rather than the field between the arms. */
const BAND = 0.3;

/** A small cross of four equal arms, couped: reaching nothing and borne like anything else. */
export const crossCouped: ChargeFigure = charge(({ x, y, size }) =>
  cross(x, y, size, Math.round(size * BAND))
);
