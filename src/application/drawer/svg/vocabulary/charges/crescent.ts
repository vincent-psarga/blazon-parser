import { crescent as moon } from '../../shapes/crescent';
import { ChargeFigure } from '../Figures';
import { charge } from './Charge';

/** A half-moon with the horns uppermost, which is the only way a crescent stands here. */
export const crescent: ChargeFigure = charge(({ x, y, size }) => moon(x, y, size));
