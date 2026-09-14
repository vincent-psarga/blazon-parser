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

/**
 * Neither metal nor colour but a rank of their own, being the patterned pelts a
 * field may be covered with.
 */
export enum Furs {
  ermine = 'Furs.ermine',
  vair = 'Furs.vair',
}

export type Tincture = Metals | Colours | Furs;

export const TINCTURES: readonly Tincture[] = [
  ...Object.values(Metals),
  ...Object.values(Colours),
  ...Object.values(Furs),
];

export function isTincture(value: string): value is Tincture {
  return (TINCTURES as readonly string[]).includes(value);
}
