import { Shape } from './Shape';

export const polygon =
  (points: string): Shape =>
  (fill) =>
    `<polygon points="${points}" fill="${fill}"/>`;
