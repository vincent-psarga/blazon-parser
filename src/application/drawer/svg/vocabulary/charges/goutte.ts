import { drop } from '../../shapes/drop';
import { ChargeFigure } from '../Figures';
import { charge } from './Charge';

/**
 * A drop, point upwards. "They are seldom, if ever, used singly, and generally
 * the number is enumerated" — which is as true of the field sown with them,
 * where a goutte is commonest of all.
 */
export const goutte: ChargeFigure = charge(({ x, y, size }) => drop(x, y, size));
