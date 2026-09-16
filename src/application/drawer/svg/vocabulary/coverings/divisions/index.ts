import { DivisionType } from '../../../../../../domain/models/Field';
import { DivisionFigure } from '../../Figures';
import { bend } from './bend';
import { bendSinister } from './bendSinister';
import { fess } from './fess';
import { pale } from './pale';

/**
 * Where the two halves of a divided field lie, before the frame clips them.
 *
 * Being keyed on DivisionType, a partition added to the vocabulary breaks this
 * until it is given a shape.
 */
export const DIVISIONS: Record<DivisionType, DivisionFigure> = {
  [DivisionType.pale]: pale,
  [DivisionType.fess]: fess,
  [DivisionType.bend]: bend,
  [DivisionType.bendSinister]: bendSinister,
};
