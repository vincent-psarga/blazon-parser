import { Modifier } from '../../../../../domain/models/Modifier';
import { diamond, hollowDiamond } from '../../shapes/diamond';
import { ChargeFigure } from '../Figures';
import { charge } from './Charge';

/** A lozenge is a diamond standing on end, and stands a little less narrow than a billet. */
const WIDE = 0.75;

/**
 * How much of a voided lozenge is the line rather than the field showing through
 * it, reckoned across the narrow way — the annulet's own proportion, measured
 * the same way.
 */
const BAND = 0.22;

/** A diamond standing on one of its points, taller than it is wide. */
export const lozenge: ChargeFigure = charge(
  ({ x, y, size }) => diamond(x, y, Math.round((size * WIDE) / 2), Math.round(size / 2)),
  {
    [Modifier.voided]: ({ x, y, size }) =>
      hollowDiamond(
        x,
        y,
        Math.round((size * WIDE) / 2),
        Math.round(size / 2),
        Math.round(size * WIDE * BAND)
      ),
  }
);
