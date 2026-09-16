import { BELL_HEIGHT, BELL_WIDTH, bells } from '../../../shapes/bell';
import { tileId, tiled } from '../../../shapes/tile';
import { FurredFigure } from '../../Figures';

/**
 * The bells of vair, cut from whatever two paints a blazon's tinctures resolve
 * to rather than from the argent and azure vair itself is always drawn in.
 *
 * The first paint is laid down whole and the second cut into bells over it,
 * which puts the first along the chief, as vair is always drawn.
 */
export const vairy: FurredFigure = {
  pelt: (frame, ground, figure, edge) =>
    tiled(
      tileId('vairy', ground, figure),
      frame,
      BELL_WIDTH,
      BELL_HEIGHT * 2,
      ground,
      bells(edge),
      figure
    ),
};
