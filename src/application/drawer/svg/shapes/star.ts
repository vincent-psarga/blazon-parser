import { Shape } from './Shape';
import { circleOutline } from './disc';
import { hollow } from './hollow';
import { polygon } from './polygon';

/** How far the inner corners stand from the centre, against the points. */
const WAIST = 0.4;

/** A quarter turn, so the first point stands straight up rather than out to the side. */
const UPRIGHT = -Math.PI / 2;

/** Half a unit is finer than any shield is drawn, and keeps the path readable. */
const round = (value: number): number => Math.round(value * 2) / 2;

/**
 * The corners of such a star, points and waists alternating, the first point
 * upright.
 *
 * Reckoned apart from the drawing because two drawings want them: the star
 * itself, written as a polygon, and its outline, written as a path so it can
 * enclose another.
 */
const corners = (
  x: number,
  y: number,
  radius: number,
  points: number
): readonly (readonly [number, number])[] =>
  Array.from({ length: points * 2 }, (_, corner) => {
    const reach = corner % 2 === 0 ? radius : radius * WAIST;
    const angle = UPRIGHT + (corner * Math.PI) / points;
    return [round(x + reach * Math.cos(angle)), round(y + reach * Math.sin(angle))] as const;
  });

/**
 * A star of straight rays about a centre: points at the given radius and the
 * corners between them drawn in, which is what makes the rays rays rather than
 * the sides of a polygon.
 *
 * The first point stands upright. Everything else follows from the count, so the
 * same figure serves five rays or six without knowing which heraldry meant.
 */
export const star = (x: number, y: number, radius: number, points: number): Shape =>
  polygon(
    corners(x, y, radius, points)
      .map(([at, down]) => `${at},${down}`)
      .join(' ')
  );

/** The outline of such a star, written as a path so it can enclose another. */
const outline = (x: number, y: number, radius: number, points: number): string =>
  `${corners(x, y, radius, points)
    .map(([at, down], corner) => `${corner === 0 ? 'M' : 'L'} ${at} ${down}`)
    .join(' ')} Z`;

/**
 * How far the centre of such a star stands from the nearest point of its
 * outline, which is how much room there is inside it.
 *
 * A side runs from a point to the waist beside it, and that triangle gives the
 * distance as the height dropped onto the side from the centre.
 *
 * A star has less room in it than any other figure drawn here. Its sides come in
 * to the waist, which stands at two fifths of the radius, so what is left is a
 * third of what the lozenge offers — which is why a band or a hole reckoned the
 * lozenge's way would close the figure outright, and why both are reckoned off
 * this instead.
 */
export const roomInStar = (radius: number, points: number): number => {
  const waist = radius * WAIST;
  const span = Math.PI / points;
  const side = Math.hypot(radius - waist * Math.cos(span), waist * Math.sin(span));
  return (radius * waist * Math.sin(span)) / side;
};

/**
 * The same star with its middle out, the band an even thickness all the way
 * round.
 *
 * A smaller star drawn inside a larger one leaves a band of even thickness only
 * if it is the larger one shrunk towards the centre — the two then have parallel
 * sides — so what is reckoned here is how far to shrink it.
 */
export const hollowStar = (
  x: number,
  y: number,
  radius: number,
  points: number,
  band: number
): Shape => {
  const left = Math.max(0, 1 - band / roomInStar(radius, points));
  return hollow(outline(x, y, radius, points), outline(x, y, radius * left, points));
};

/**
 * The same star with a round hole punched through the middle of it, the rest of
 * it left painted: the molette, the rowel of a spur, where the hollow one is a
 * star voided.
 */
export const piercedStar = (
  x: number,
  y: number,
  radius: number,
  points: number,
  radiusOfHole: number
): Shape => hollow(outline(x, y, radius, points), circleOutline(x, y, radiusOfHole));
