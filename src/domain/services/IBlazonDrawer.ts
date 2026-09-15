import { Blazon } from '../models/Blazon';
import { FurType } from '../models/Field';
import { Tincture } from '../models/Tinctures';

/**
 * A texture a tincture is painted with, rather than a flat colour: the hatching
 * that stands in for colour in monochrome, and the furs when they arrive.
 *
 * The two halves are written in the drawer's own terms — it is the drawer that
 * places the definition and resolves the fill against it.
 */
export type Pattern = {
  /** What a shape is filled with, referring to the definition below. */
  fill: string;
  /** The definition that fill refers to. */
  definition: string;
};

/** How one tincture is painted: a plain colour, or a pattern. */
export type Paint = string | Pattern;

/**
 * How a fur is cut from two tinctures which are not its own: vair is a tincture
 * and is painted like any other, where vairé is the same bells asked for in
 * whatever pair a blazon names.
 *
 * It belongs to the colouring rather than to the drawer because only the
 * colouring knows what its tinctures are made of — a hatched shield cuts the
 * bells out of ruling where a coloured one cuts them out of colour — and it must
 * be a pattern rather than a paint, the bells being a figure repeated over the
 * field however much of it the fur covers.
 */
export type FurCutting = (type: FurType, first: Tincture, second: Tincture) => Pattern;

/**
 * What every tincture is painted with, and how the furs are cut from pairs of
 * them. A colouring answers for both: the tinctures it lays are what the bells
 * are filled with.
 */
export type ColorModel = Record<Tincture, Paint> & {
  readonly cut: FurCutting;
};

export type DrawOptions = {
  colorModel: ColorModel;
};

export interface IBlazonDrawer {
  draw(blazon: Blazon, drawOptions?: DrawOptions): string;
}

export function isPattern(paint: Paint): paint is Pattern {
  return typeof paint !== 'string';
}
