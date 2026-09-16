import { Tincture, isFur } from '../../../../../domain/models/Tinctures';
import { Paint, isPattern } from '../../../../../domain/services/IBlazonDrawer';
import { Ground, Ink } from '../../Ground';
import { escapeAttribute } from '../../escaping';
import { FURS } from './furs';

/** What a tincture is painted with here, and whatever that paint refers to. */
export type Painted = {
  readonly paint: Paint;
  /**
   * The tinctures whose own paint this one refers to, and whose definitions it
   * therefore needs beside it: the bells of a hatched vair are filled with the
   * ruling that stands for azure, and a drawing showing one must carry both.
   */
  readonly refersTo: readonly Tincture[];
};

/**
 * What a tincture is painted with, asked of the colouring rather than assumed:
 * heraldry fixes no shade, and a tincture may be a pattern as readily as a
 * colour — the hatching that stands in for colour in monochrome.
 *
 * A fur is no shade at all but a figure, so the colouring is asked only for the
 * pair it is cut from and the drawer cuts it. The figure is drawn in the
 * colouring's own ink where the pelt says it is a mark and the colouring has
 * one; otherwise in the second tincture's own paint.
 */
export function painted(ground: Ground, tincture: Tincture): Painted {
  if (!isFur(tincture)) {
    return { paint: ground.colours[tincture], refersTo: [] };
  }
  const fur = FURS[tincture];
  const [laid, cut] = fur.from;
  const ink = fur.inked === true ? ground.colours.ink : undefined;
  return {
    paint: fur.pelt.pelt(
      ground.frame,
      fillOf(ground, laid),
      ink ?? fillOf(ground, cut),
      ground.colours.ink
    ),
    refersTo: ink === undefined ? [laid, cut] : [laid],
  };
}

/**
 * The fill a tincture resolves to, unescaped: a definition carries these inside
 * itself, where an attribute written into the drawing is escaped at the edge.
 */
export function fillOf(ground: Ground, tincture: Tincture): string {
  const { paint } = painted(ground, tincture);
  return isPattern(paint) ? paint.fill : paint;
}

/** A tincture as something a shape may be painted with. */
export const tincture =
  (tincture: Tincture): Ink =>
  (ground: Ground) =>
    escapeAttribute(fillOf(ground, tincture));
