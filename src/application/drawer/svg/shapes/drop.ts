import { Shape } from './Shape';
import { placed } from './path';

/**
 * A drop: "a figure of an elongated pear-shape, with the sides wavy".
 *
 * Drawn about its own centre in a box one unit across and one tall, so that
 * whatever places it need only say where and how big. The point is at the top
 * and the swell at the bottom, and the sides run in from the point before they
 * curve out again, which is the wave.
 */
const DROP =
  'M0 -0.5' +
  ' C-0.05 -0.2 -0.34 -0.05 -0.34 0.15' +
  ' C-0.34 0.36 -0.19 0.5 0 0.5' +
  ' C0.19 0.5 0.34 0.36 0.34 0.15' +
  ' C0.34 -0.05 0.05 -0.2 0 -0.5 Z';

/** A drop about a centre, standing that many units tall. */
export const drop = (x: number, y: number, size: number): Shape => placed(DROP, x, y, size);
