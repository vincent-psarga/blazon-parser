import { rectangle } from '../../shapes/rectangle';
import { ChargeFigure } from '../Figures';
import { charge } from './Charge';

/** A billet is a rectangle standing on end, half as wide as it is tall. */
const WIDE = 0.5;

/** An upright rectangle: the little billet, a note or a log. */
export const billet: ChargeFigure = charge(({ x, y, size }) => {
  const across = Math.round(size * WIDE);
  return rectangle(x - Math.round(across / 2), y - Math.round(size / 2), across, size);
});
