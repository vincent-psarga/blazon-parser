import { Shape } from './Shape';
import { polygon } from './polygon';

/** A diamond standing on one of its points, about a centre. */
export const diamond = (x: number, y: number, across: number, tall: number): Shape =>
  polygon(`${x},${y - tall} ${x + across},${y} ${x},${y + tall} ${x - across},${y}`);
