import { FieldType, FurType, Furred } from '../../../../../../domain/models/Field';
import { Pattern } from '../../../../../../domain/services/IBlazonDrawer';
import { Ground } from '../../../Ground';
import { FurredFigure } from '../../Figures';
import { fillOf } from '../../tinctures/paint';
import { vairy } from './vairy';

/**
 * The pelt each furred field is covered with. Being keyed on FurType, a fur
 * added to the vocabulary breaks this until it is given one.
 */
export const FURRED: Record<FurType, FurredFigure> = {
  [FieldType.vairy]: vairy,
};

/**
 * The pelt a furred field is covered with, cut from the two tinctures it names.
 *
 * It is asked for twice over — once for the fill and once for the definition
 * that fill refers to — so it answers the same for the same pair, and the
 * drawing carries one definition however often it is asked.
 */
export function peltOf(ground: Ground, field: Furred): Pattern {
  return FURRED[field.type].pelt(
    ground.frame,
    fillOf(ground, field.firstTincture),
    fillOf(ground, field.secondTincture),
    ground.colours.ink
  );
}
