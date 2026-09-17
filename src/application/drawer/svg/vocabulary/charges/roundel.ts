import { disc } from '../../shapes/disc';
import { ChargeFigure } from '../Figures';
import { charge } from './Charge';

/**
 * A plain disc, filled: a besant, a plate, a tourteau, and every other name the
 * armorials gave the same circle for the sake of its tincture.
 *
 * It is drawn to the room a charge is given entire, being round and therefore
 * already narrower than the square it stands in — where a lozenge is drawn a
 * little narrow so as not to look swollen beside one.
 */
export const roundel: ChargeFigure = charge(({ x, y, size }) => disc(x, y, Math.round(size / 2)));
