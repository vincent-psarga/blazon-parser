import { spaced } from '../../painting/arrange';
import { bent } from '../../shapes/bands';
import { BorneFigure } from '../Figures';

/** The room the chevrons share, measured down the field from their highest point. */
const CHEVRONS_FROM = 8;
const CHEVRONS = 180;

/** An inverted V, its point towards the chief and its limbs running to the base. */
export const chevron: BorneFigure = {
  shapes: (frame, count) => spaced(count, CHEVRONS_FROM, CHEVRONS).map(bent(frame)),
};
