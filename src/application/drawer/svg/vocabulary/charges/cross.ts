import { Modifier } from '../../../../../domain/models/Modifier';
import { cross as crossShape, hollowCross } from '../../shapes/cross';
import { ChargeFigure } from '../Figures';
import { charge } from './Charge';

/** How much of the cross is arm rather than the field between the arms. */
const BAND = 0.3;

/**
 * How much of a voided cross is the line rather than the field showing through
 * it, reckoned across the arm: the proportion the annulet and the lozenge are
 * both voided by, measured the same way.
 */
const LINE = 0.22;

/** How thick the arms of a cross of this size are drawn. */
const armOf = (size: number) => Math.round(size * BAND);

/** A small cross of four equal arms, couped: reaching nothing and borne like anything else. */
export const cross: ChargeFigure = charge(({ x, y, size }) => crossShape(x, y, size, armOf(size)), {
  // Voided, the figure keeps its own outline and the field shows through the
  // middle of it — twelve corners within twelve, where a voided lozenge has
  // four within four. The couping is no part of this: the small cross is
  // couped in every drawing of it, and what the voiding takes out is the
  // middle rather than the ends.
  [Modifier.voided]: ({ x, y, size }) =>
    hollowCross(x, y, size, armOf(size), Math.round(armOf(size) * LINE)),
});
