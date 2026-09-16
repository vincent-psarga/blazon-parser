import { rectangle } from '../../shapes/rectangle';
import { BorneFigure } from '../Figures';

/** Limbs that cross are narrower than a band that does not, being two. */
const ARM = 28;

/**
 * The pale and the fess crossing. One charge for all that it is drawn twice
 * over, which is why a count neither narrows nor spaces it: repeated, a cross
 * becomes crosslets, which are charges strewn on the field.
 */
export const cross: BorneFigure = {
  shapes: ({ width, height }) => [
    rectangle(width / 2 - ARM, 0, ARM * 2, height),
    rectangle(0, height / 2 - ARM, width, ARM * 2),
  ],
};
