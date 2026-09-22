import { Modifier } from '../../../../../domain/models/Modifier';
import { spaced } from '../../painting/arrange';
import { bent, bentIndented } from '../../shapes/bands';
import { OrdinaryFigure } from '../Figures';

/** The room the chevrons share, measured down the field from their highest point. */
const CHEVRONS_FROM = 8;
const CHEVRONS = 180;

/** An inverted V, its point towards the chief and its limbs running to the base. */
export const chevron: OrdinaryFigure = {
  shapes: (frame, count) => spaced(count, CHEVRONS_FROM, CHEVRONS).map(bent(frame)),
  // Both limbs are cut, and the point between them is left where it was: the
  // teeth are counted along each limb rather than along the whole line, so
  // neither limb ends on half a tooth and the chevron keeps its point.
  modified: {
    [Modifier.indented]: {
      shapes: (frame, count) => spaced(count, CHEVRONS_FROM, CHEVRONS).map(bentIndented(frame)),
    },
  },
};
