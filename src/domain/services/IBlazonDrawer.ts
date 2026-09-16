import { Blazon } from '../models/Blazon';
import { Shade } from '../models/Tinctures';

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
 * What every shade is painted with.
 *
 * The furs are not among them: a fur is a figure repeated over the field, and
 * the figure is the drawer's — an ermine spot is the same spot in every
 * armorial. What a colouring contributes to a fur is the shades its figures are
 * cut from, which it has already given.
 */
export type ColorModel = Record<Shade, Paint> & {
  /**
   * The colour this colouring draws its marks in, where it draws in marks at
   * all.
   *
   * A colouring that paints in colour has none: its tinctures tell themselves
   * apart, so an ermine spot is simply sable and bells of one ruling against
   * another never arise. A colouring that rules its tinctures has one, and needs
   * it twice over — the spots of an ermine are marks rather than a tincture, and
   * bells cut out of ruling read as neither without a line between them.
   */
  readonly ink?: string;
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
