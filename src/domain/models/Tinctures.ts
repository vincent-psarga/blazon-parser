export enum Metals {
  or = 'Metals.or',
  argent = 'Metals.argent',
}

export enum Colours {
  azure = 'Colours.azure',
  gules = 'Colours.gules',
  sable = 'Colours.sable',
  vert = 'Colours.vert',
}

export type Tincture = Metals | Colours;

export const TINCTURES: readonly Tincture[] = [...Object.values(Metals), ...Object.values(Colours)];

export function isTincture(value: string): value is Tincture {
  return (TINCTURES as readonly string[]).includes(value);
}
