import { Shape } from './Shape';
import { polygon } from './polygon';

/** How far the inner corners stand from the centre, against the points. */
const WAIST = 0.4;

/** A quarter turn, so the first point stands straight up rather than out to the side. */
const UPRIGHT = -Math.PI / 2;

/**
 * A star of straight rays about a centre: points at the given radius and the
 * corners between them drawn in, which is what makes the rays rays rather than
 * the sides of a polygon.
 *
 * The first point stands upright. Everything else follows from the count, so the
 * same figure serves five rays or six without knowing which heraldry meant.
 */
export const star = (x: number, y: number, radius: number, points: number): Shape => {
  const corners = Array.from({ length: points * 2 }, (_, corner) => {
    const reach = corner % 2 === 0 ? radius : radius * WAIST;
    const angle = UPRIGHT + (corner * Math.PI) / points;
    return `${round(x + reach * Math.cos(angle))},${round(y + reach * Math.sin(angle))}`;
  });
  return polygon(corners.join(' '));
};

/** Half a unit is finer than any shield is drawn, and keeps the path readable. */
const round = (value: number): number => Math.round(value * 2) / 2;
