import { stroked } from '../../shapes/path';
import { OrdinaryFigure } from '../Figures';

/** How far a bordure reaches in from the edge: an eighth of the field, as armorials draw it. */
const DEEP = 1 / 8;

/**
 * A band following the whole edge of the shield, inside it.
 *
 * It is the frame's own outline drawn as a thick stroke, which the clip path then
 * halves — so the band keeps the asked-for width and follows the curve of the
 * base, which nothing built out of rectangles would do.
 *
 * The bordure crosses the field nowhere: it follows the edge, and a shield has
 * one edge, so there is nothing for a count to narrow or space out.
 */
export const bordure: OrdinaryFigure = {
  shapes: ({ path, width }) => [stroked(path, width * DEEP * 2)],
  // Nothing: the model gives this band no modified line, so there is no second
  // drawing to hold. See OrdinaryDefinitions for why.
  modified: {},
};
