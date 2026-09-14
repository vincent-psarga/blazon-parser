import { Blazon } from '../models/Blazon';
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

export type ColorModel = Record<Tincture, Paint>;

export type DrawOptions = {
  colorModel: ColorModel;
};

export interface IBlazonDrawer {
  draw(blazon: Blazon, drawOptions?: DrawOptions): string;
}

export function isPattern(paint: Paint): paint is Pattern {
  return typeof paint !== 'string';
}
