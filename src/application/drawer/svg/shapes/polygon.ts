import { Shape, swelling } from './Shape';

export const polygon =
  (points: string): Shape =>
  (brush) =>
    `<polygon points="${points}" fill="${brush.fill}"${swelling(brush)}/>`;
