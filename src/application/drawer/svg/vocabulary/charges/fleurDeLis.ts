import { lily } from '../../shapes/lily';
import { ChargeFigure } from '../Figures';
import { charge } from './Charge';

/** The lily heraldry drew as a smith would forge it. */
export const fleurDeLis: ChargeFigure = charge(({ x, y, size }) => lily(x, y, size));
