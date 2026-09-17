import { Shape } from './Shape';
import { filled } from './path';

/** How much of the moon the bite takes out, against the whole of it. */
const BITE = 0.82;

/** How far the bite is set towards the horns, against the whole radius. */
const TOWARDS_THE_HORNS = 0.38;

/**
 * A half-moon with the horns uppermost: a disc with a smaller disc taken out of
 * it, set towards the chief, so that what is left comes to a point either side.
 *
 * The horns are where the two circles cross, which is arithmetic rather than
 * draughtsmanship — so they are worked out rather than drawn by eye, and the
 * crescent keeps its shape at every size it is drawn.
 *
 * Its own numbers are worked out here rather than written in a box one unit
 * across and scaled, because an arc carries radii and flags among its numbers
 * and a path scaled by counting them would scale those too.
 */
export const crescent = (x: number, y: number, size: number): Shape => {
  const whole = size / 2;
  const bite = whole * BITE;
  const apart = whole * TOWARDS_THE_HORNS;

  // Where the two circles cross, measured from the centre of the whole one.
  const height = (bite * bite - whole * whole - apart * apart) / (2 * apart);
  const reach = Math.sqrt(whole * whole - height * height);

  const dexter = `${round(x - reach)} ${round(y + height)}`;
  const sinister = `${round(x + reach)} ${round(y + height)}`;

  return filled(
    `M${dexter}` +
      // The long way round the base, which is the whole of the moon that shows.
      ` A${round(whole)} ${round(whole)} 0 1 0 ${sinister}` +
      // And back along the bite, the short way, leaving the horns as points.
      ` A${round(bite)} ${round(bite)} 0 1 1 ${dexter} Z`
  );
};

/** Half a unit is finer than any shield is drawn, and keeps the path readable. */
const round = (value: number): number => Math.round(value * 2) / 2;
