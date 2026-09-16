import { Tincture } from '../../../../domain/models/Tinctures';
import { Frame, Ink } from '../Ground';
import { Shape } from '../shapes/Shape';

/*
 * What each kind of term contributes to a drawing.
 *
 * Every one of them is a record with a named member rather than a bare
 * function, because the day a band can be charged it will have to answer for
 * more than its own paint: three mullets on a bend are clipped to the band and
 * arranged along its axis, so the bend must offer the frame it carries as well
 * as the shapes it lays. A record grows that member; a bare function would have
 * to become one.
 *
 * Every member takes the frame it is drawn in rather than measuring itself
 * against the drawing, so that nothing here has to change the day a quarter is
 * a frame of its own.
 */

/** A field cut in two along a line: the half in chief first. */
export type DivisionFigure = {
  readonly halves: (frame: Frame) => readonly [Shape, Shape];
};

/**
 * A field cut along one line over and over. Half the pieces are drawn — the
 * field is painted the first tincture entire and these are laid over it in the
 * second — so what is returned is the shapes to lay, not every piece.
 */
export type VariationFigure = {
  readonly pieces: (frame: Frame, pieces: number) => readonly Shape[];
};

/**
 * A field covered with a pelt cut from two tinctures it names. The cutting is
 * the colouring's, so what a fur contributes is an ink rather than a shape.
 */
export type FurredFigure = {
  readonly ink: (first: Tincture, second: Tincture) => Ink;
};

/**
 * Something the field bears — a band or a charge, which are drawn alike however
 * differently they are placed. Each is asked how many are borne, and the ones
 * borne but once are entitled to ignore the answer: a chief is the top of the
 * shield and there is one of those.
 */
export type BorneFigure = {
  readonly shapes: (frame: Frame, count: number) => readonly Shape[];
};
