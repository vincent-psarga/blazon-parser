import { rectangle } from '../../shapes/rectangle';
import { BorneFigure } from '../Figures';
import { spots } from './disposition';

/** A billet is a rectangle standing on end, half as wide as it is tall. */
const WIDE = 0.5;

/** An upright rectangle: the little billet, a note or a log. */
export const billet: BorneFigure = {
  shapes: (frame, count) =>
    spots(frame, count).map(({ x, y, size }) => {
      const across = Math.round(size * WIDE);
      return rectangle(x - Math.round(across / 2), y - Math.round(size / 2), across, size);
    }),
};
