import { Blazon } from '../../../domain/models/Blazon';
import { Furred, isDivision, isFurred, isVariation } from '../../../domain/models/Field';
import { Tincture } from '../../../domain/models/Tinctures';
import {
  ColorModel,
  DrawOptions,
  IBlazonDrawer,
  Pattern,
} from '../../../domain/services/IBlazonDrawer';
import { arms } from './Arms';
import { definitions, document } from './Document';
import { SHIELD_FRAME } from './shapes/shield';

const DEFAULT_OUTLINE = '#1a1a1a';

/** Draws a blazon as an SVG shield. */
export class SvgBlazonDrawer implements IBlazonDrawer {
  /**
   * The outline is a property of the ground the arms are drawn on, not of the
   * arms, so it is supplied rather than assumed: a shield drawn near-black
   * vanishes on a dark page, which is the one thing a drawing must never do.
   */
  constructor(
    private readonly colours: ColorModel,
    private readonly outline: string = DEFAULT_OUTLINE
  ) {}

  draw(blazon: Blazon, drawOptions?: DrawOptions): string {
    const colours = drawOptions?.colorModel ?? this.colours;
    return document(
      SHIELD_FRAME,
      definitions(colours, tincturesOf(blazon), cutFor(blazon, colours)),
      arms(blazon)({ frame: SHIELD_FRAME, colours }),
      this.outline
    );
  }
}

function tincturesOf(blazon: Blazon): readonly Tincture[] {
  const painted = blazon.field;
  const field =
    isDivision(painted) || isVariation(painted) || isFurred(painted)
      ? [painted.firstTincture, painted.secondTincture]
      : [painted.tincture];
  return [...field, ...(blazon.chargesOrOrdinaries ?? []).map(({ tincture }) => tincture)];
}

/**
 * The fur a furred field is covered with, cut from the two tinctures it names.
 *
 * It is asked for twice over — once here for the definition and once by the
 * vocabulary for the fill that refers to it — so the cutting answers the same
 * for the same pair, and the drawing carries one definition however often it is
 * asked.
 */
function cutFor(blazon: Blazon, colours: ColorModel): Pattern | undefined {
  return isFurred(blazon.field) ? cut(blazon.field, colours) : undefined;
}

function cut(field: Furred, colours: ColorModel): Pattern {
  return colours.cut(field.type, field.firstTincture, field.secondTincture);
}
