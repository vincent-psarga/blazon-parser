import { Shape } from '../../shapes/Shape';
import { ChargeFigure } from '../Figures';
import { Spot, spots, strewing } from './disposition';

/**
 * A charge, built from the one thing that is its own: what it looks like at a
 * spot, in a size.
 *
 * Where the spots are is the disposition's business and not the figure's. A
 * counted few are ranged in ranks and drawn large; a field sown with them is
 * covered edge to edge in small ones past counting. The shape is the same
 * either way, which is why a semy needs no second drawing of anything.
 */
export function charge(at: (spot: Spot) => Shape): ChargeFigure {
  return {
    at,
    shapes: (frame, count) => spots(frame, count).map(at),
    strewn: (frame) => strewing(frame).map(at),
  };
}
