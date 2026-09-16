import { Blazon, ChargeOrOrdinary, isOrdinary } from '../../../domain/models/Blazon';
import { numberBorne } from '../../../domain/models/Charge';
import { Field, isDivision, isFurred, isVariation } from '../../../domain/models/Field';
import { borne } from '../../../domain/models/Ordinary';
import { Painter } from './Ground';
import { laid } from './painting/laid';
import { over } from './painting/over';
import { plain } from './painting/plain';
import { split } from './painting/split';
import { CHARGES } from './vocabulary/charges';
import { DIVISIONS } from './vocabulary/coverings/divisions';
import { FURRED } from './vocabulary/coverings/furred';
import { ORDINARIES } from './vocabulary/ordinaries';
import { INKS } from './vocabulary/tinctures';
import { VARIATIONS } from './vocabulary/coverings/variations';

/**
 * A blazon read into the vocabulary that knows how to draw it.
 *
 * This is the one place the model and the drawing meet: everything under
 * vocabulary/ is named after a term and knows nothing of Blazon, and everything
 * under shapes/ and painting/ knows nothing of heraldry at all.
 *
 * The field first, then whatever it bears: what is laid on the field is laid
 * over it, not under. Several are painted in the order the blazon named them,
 * each over the last, which is what that order is for — a bordure blazoned after
 * three bends covers where they meet the edge, and blazoned before them is
 * covered by them. A band and a charge answer to the same order: a bend blazoned
 * after a billet is drawn over the billet, and before it is drawn under.
 */
export function arms(blazon: Blazon): Painter {
  return over(field(blazon.field), ...(blazon.chargesOrOrdinaries ?? []).map(bearing));
}

/**
 * The field, cut whichever of the four ways it is cut.
 *
 * A varied field is painted the first tincture entire and every other piece laid
 * over it in the second, which puts the first piece where the armorials put it:
 * in chief, or against the dexter chief corner. A pelt covers the whole field
 * rather than cutting it, so there is nothing to lay over anything.
 */
function field(field: Field): Painter {
  if (isVariation(field)) {
    return over(
      plain(INKS[field.firstTincture]),
      laid(
        (frame) => VARIATIONS[field.type].pieces(frame, field.pieces),
        INKS[field.secondTincture]
      )
    );
  }
  if (isFurred(field)) {
    return plain(FURRED[field.type].ink(field.firstTincture, field.secondTincture));
  }
  if (isDivision(field)) {
    return split(
      (frame) => DIVISIONS[field.type].halves(frame),
      INKS[field.firstTincture],
      INKS[field.secondTincture]
    );
  }
  return plain(INKS[field.tincture]);
}

/**
 * A band or a charge, drawn by whichever vocabulary its term belongs to, however
 * many of it are borne: two chevrons are two bands of one tincture, not two
 * charges each with its own.
 */
function bearing(one: ChargeOrOrdinary): Painter {
  const [figure, count] = isOrdinary(one)
    ? ([ORDINARIES[one.type], borne(one)] as const)
    : ([CHARGES[one.type], numberBorne(one)] as const);
  return laid((frame) => figure.shapes(frame, count), INKS[one.tincture]);
}
