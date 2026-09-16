import { Tincture } from '../../../domain/models/Tinctures';
import { Pattern, isPattern } from '../../../domain/services/IBlazonDrawer';
import { Frame, Ground } from './Ground';
import { escapeAttribute } from './escaping';
import { painted } from './vocabulary/tinctures/paint';

// Two SVGs inlined in one document share an id space, so this one is spelled out
// rather than left to collide with whatever else the page calls its clip path.
const SHIELD_CLIP = 'blason-shield';

const OUTLINE_WIDTH = 3;

/**
 * The drawing itself: the arms clipped to the frame, and the frame's own outline
 * over them.
 *
 * Everything the arms are made of is drawn past the edges it meets and left to
 * the clip path, so a band keeps its own width and angle instead of being fitted
 * to the curve of the shield.
 */
export function document(frame: Frame, definitions: string, arms: string, outline: string): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${frame.width} ${frame.height}"`,
    ` width="${frame.width}" height="${frame.height}">`,
    `<defs><clipPath id="${SHIELD_CLIP}"><path d="${frame.path}"/></clipPath>`,
    definitions,
    `</defs>`,
    `<g clip-path="url(#${SHIELD_CLIP})">${arms}</g>`,
    `<path d="${frame.path}" fill="none" stroke="${escapeAttribute(outline)}" stroke-width="${OUTLINE_WIDTH}"/>`,
    `</svg>`,
  ].join('');
}

/**
 * The definitions the blazon's own tinctures call for, and no others — a shield
 * carries the patterns it is painted with, not every pattern that exists. An
 * ordinary counts among them, and so does a charge: both are painted with a
 * tincture like anything else.
 *
 * A fur cut from two tinctures is a pattern no tincture of the blazon names, and
 * it is filled with the two that are named, whose own definitions the tinctures
 * have already placed — so it is passed in beside them rather than looked for.
 *
 * A definition is markup, so it is placed as it stands rather than escaped. A
 * colour model is written in code alongside the drawer, not taken from a reader.
 */
export function definitions(
  ground: Ground,
  tinctures: readonly Tincture[],
  pelt?: Pattern
): string {
  const placed = new Map<string, string>();

  // A pattern may refer to another — the bells of a hatched vair are filled with
  // the ruling that stands for azure — so what a tincture refers to is placed
  // beside it, and the map settles whatever two of them ask for alike.
  const place = (tincture: Tincture): void => {
    const { paint, refersTo } = painted(ground, tincture);
    if (!isPattern(paint) || placed.has(paint.fill)) {
      return;
    }
    placed.set(paint.fill, paint.definition);
    refersTo.forEach(place);
  };
  tinctures.forEach(place);

  if (pelt !== undefined) {
    placed.set(pelt.fill, pelt.definition);
  }
  return [...placed.values()].join('');
}
