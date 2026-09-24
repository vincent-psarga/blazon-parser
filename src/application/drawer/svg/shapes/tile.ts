import { Frame } from '../Ground';
import { Shape } from './Shape';

/** A figure repeated over a plane, and what refers to it. */
export type Tile = {
  readonly fill: string;
  readonly definition: string;
};

/**
 * A figure tiled over a ground, laid from the corner of the frame rather than
 * the corner of the drawing.
 *
 * A heater is inset from the edges of the box it is drawn in, so a pelt reckoned
 * from the box has its first figures cut through by the shield's own edge — the
 * points of the topmost bells swallowed along the chief, and the flare of their
 * bases along dexter. Laid from the frame's own corner, the chief row shows its
 * points and the dexter column its whole width, which is where heraldry starts
 * them.
 */
export function tiled(
  id: string,
  frame: Frame,
  width: number,
  height: number,
  ground: string,
  figure: Shape,
  cut: string
): Tile {
  return {
    fill: `url(#${id})`,
    definition:
      `<pattern id="${id}" x="${frame.dexter}" y="${frame.top}"` +
      ` width="${width}" height="${height}" patternUnits="userSpaceOnUse">` +
      `<rect width="${width}" height="${height}" fill="${ground}"/>` +
      figure({ fill: cut }) +
      `</pattern>`,
  };
}

/**
 * A name for one figure cut from one pair of paints.
 *
 * Ids are shared across a whole page rather than owned by one drawing, so two
 * colourings must never name one definition alike: a shield shown in colour
 * beside the same shield hatched would otherwise take the other's. Naming it
 * after the paints does that of itself — two colourings that painted a pelt
 * identically would share the one definition, which is right — and spares the
 * colourings from having to name themselves.
 */
export function tileId(figure: string, ...paints: readonly string[]): string {
  const named = paints.map((paint) => paint.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, ''));
  return [figure, ...named].join('-').toLowerCase();
}
