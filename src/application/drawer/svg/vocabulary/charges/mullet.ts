import { star } from '../../shapes/star';
import { ChargeFigure } from '../Figures';
import { charge } from './Charge';

/**
 * How many rays the star is drawn with where the blazon counts none.
 *
 * Five, which both tongues understand: "it usually has five points, and this
 * number is always to be understood when no other is mentioned", and the French
 * étoile's "figuration ordinaire comporte cinq pointes". A blazon may name
 * another number, and cannot yet, so nothing here reads one.
 */
const RAYS = 5;

/** A star of five straight rays, one of them upright. */
export const mullet: ChargeFigure = charge(({ x, y, size }) =>
  star(x, y, Math.round(size / 2), RAYS)
);
