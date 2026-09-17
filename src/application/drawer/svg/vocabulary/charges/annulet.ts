import { ring } from '../../shapes/ring';
import { ChargeFigure } from '../Figures';
import { charge } from './Charge';

/** How much of an annulet is ring rather than the field it encloses. */
const BAND = 0.22;

/** A plain ring: what it encloses is the field showing through, not its own tincture. */
export const annulet: ChargeFigure = charge(({ x, y, size }) => {
  const band = Math.round(size * BAND);
  return ring(x, y, (size - band) / 2, band);
});
