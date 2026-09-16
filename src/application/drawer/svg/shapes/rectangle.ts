import { Shape } from './Shape';

export const rectangle =
  (x: number, y: number, width: number, height: number): Shape =>
  (fill) =>
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`;
