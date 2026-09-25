/** How much of a gloss a preview shows before it breaks off. */
export const GLIMPSE = 140;

/**
 * The opening of a passage, broken off where it runs long.
 *
 * Broken at a word and never within one: a gloss cut mid-word reads as a fault
 * in the page rather than as more of the same sentence waiting under the name.
 * The ellipsis is counted against the room, so what comes back is never longer
 * than what was asked for.
 */
export function shortened(text: string, limit = GLIMPSE): string {
  if (text.length <= limit) {
    return text;
  }
  // One character over the room left by the ellipsis, so that a space landing
  // exactly at the end is found and the last whole word is kept.
  const room = limit - 1;
  const cut = text.slice(0, room + 1);
  const at = cut.lastIndexOf(' ');
  // Whatever the break leaves hanging goes with it: a comma or a dash before an
  // ellipsis is punctuation for a clause that is no longer there.
  return `${(at <= 0 ? cut.slice(0, room) : cut.slice(0, at)).replace(/[\s,;:—–-]+$/u, '')}…`;
}
