/**
 * A value on its way into an attribute. A colour model is written in code
 * alongside the drawer rather than taken from a reader, but it is still text
 * arriving from outside this file.
 */
export function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
