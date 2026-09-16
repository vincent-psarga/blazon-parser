import { ring } from '../../shapes/ring';
import { BorneFigure } from '../Figures';
import { spots } from './disposition';

/** How much of an annulet is ring rather than the field it encloses. */
const BAND = 0.22;

/** A plain ring: what it encloses is the field showing through, not its own tincture. */
export const annulet: BorneFigure = {
  shapes: (frame, count) =>
    spots(frame, count).map(({ x, y, size }) => {
      const band = Math.round(size * BAND);
      return ring(x, y, (size - band) / 2, band);
    }),
};
