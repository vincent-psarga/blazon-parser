import { rectangle } from '../../shapes/rectangle';
import { BorneFigure } from '../Figures';

/** A chief takes a third of the shield, as every single band does. */
const DEEP = 80;

/**
 * The top of the shield itself rather than a band laid anywhere on it, which is
 * why there is one of them however many a blazon asks for.
 */
export const chief: BorneFigure = {
  shapes: ({ width }) => [rectangle(0, 0, width, DEEP)],
};
