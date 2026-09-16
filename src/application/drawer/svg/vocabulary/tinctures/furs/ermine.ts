import { Colours, Metals } from '../../../../../../domain/models/Tinctures';
import { SPOTS, spots } from '../../../shapes/spot';
import { tileId, tiled } from '../../../shapes/tile';
import { FurredFigure } from '../../Figures';
import { FurTincture } from './FurTincture';

/** A ground strewn with ermine spots. Semy is not in the model yet, so this
 * pelt answers to no field of its own — only to the tincture below. */
const strewn: FurredFigure = {
  pelt: (frame, ground, figure) =>
    tiled(tileId('ermine', ground, figure), frame, SPOTS, SPOTS, ground, spots, figure),
};

/** Argent strewn with sable spots: a pelt, and a tincture in its own right. */
export const ermine: FurTincture = {
  pelt: strewn,
  from: [Metals.argent, Colours.sable],
  inked: true,
};
