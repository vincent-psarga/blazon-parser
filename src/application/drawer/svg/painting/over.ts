import { Painter } from '../Ground';

/**
 * One painting over another, in the order given: what is named last is drawn
 * last, and so covers the rest.
 */
export const over =
  (...painters: readonly Painter[]): Painter =>
  (ground) =>
    painters.map((painter) => painter(ground)).join('');
