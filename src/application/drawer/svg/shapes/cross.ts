import { Shape } from './Shape';
import { polygon } from './polygon';

/**
 * A cross of four equal arms about a centre, stopping short of anything: the
 * ordinary's own figure made small enough to be borne.
 *
 * Twelve corners, which is what a cross is when nothing is rounded off.
 */
export const cross = (x: number, y: number, size: number, band: number): Shape => {
  const arm = size / 2;
  const half = band / 2;
  return polygon(
    [
      `${x - half},${y - arm}`,
      `${x + half},${y - arm}`,
      `${x + half},${y - half}`,
      `${x + arm},${y - half}`,
      `${x + arm},${y + half}`,
      `${x + half},${y + half}`,
      `${x + half},${y + arm}`,
      `${x - half},${y + arm}`,
      `${x - half},${y + half}`,
      `${x - arm},${y + half}`,
      `${x - arm},${y - half}`,
      `${x - half},${y - half}`,
    ].join(' ')
  );
};
