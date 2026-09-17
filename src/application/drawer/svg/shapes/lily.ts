import { Shape } from './Shape';
import { placed } from './path';

/**
 * The lily as heraldry draws it: not the flower but the thing the smiths made of
 * it — a middle petal rising to a point, two more sweeping up and away either
 * side and curling at their tips, a band across the three where they meet, and a
 * foot flaring below it.
 *
 * Written about its own centre in a box one unit across and one tall, so that
 * whatever places it need only say where and how big. Four parts to one path, so
 * that a tincture fills the whole of it at once: the band is part of the figure
 * rather than something laid over it.
 */
const LILY =
  // The middle petal: up to the point, and straight down to the band.
  'M0 -0.5' +
  ' C0.06 -0.34 0.1 -0.2 0.1 -0.02' +
  ' L0.1 0.08 L-0.1 0.08 L-0.1 -0.02' +
  ' C-0.1 -0.2 -0.06 -0.34 0 -0.5 Z' +
  // The petal to dexter: a fat crescent leaving the band, arching out over
  // itself, and turning its tip down and away.
  ' M-0.12 0.08' +
  ' C-0.15 -0.12 -0.28 -0.3 -0.42 -0.28' +
  ' C-0.52 -0.27 -0.52 -0.12 -0.44 -0.08' +
  ' C-0.36 -0.06 -0.3 0 -0.24 0.04' +
  ' C-0.2 0.06 -0.15 0.07 -0.12 0.08 Z' +
  // And the same to sinister.
  ' M0.12 0.08' +
  ' C0.15 -0.12 0.28 -0.3 0.42 -0.28' +
  ' C0.52 -0.27 0.52 -0.12 0.44 -0.08' +
  ' C0.36 -0.06 0.3 0 0.24 0.04' +
  ' C0.2 0.06 0.15 0.07 0.12 0.08 Z' +
  // The band across all three.
  ' M-0.3 0.08 L0.3 0.08 L0.3 0.18 L-0.3 0.18 Z' +
  // The foot, flaring to the base.
  ' M-0.1 0.2' +
  ' C-0.1 0.33 -0.19 0.42 -0.28 0.5' +
  ' L0.28 0.5' +
  ' C0.19 0.42 0.1 0.33 0.1 0.2 Z';

/** A fleur-de-lis about a centre, standing that many units tall. */
export const lily = (x: number, y: number, size: number): Shape => placed(LILY, x, y, size);
