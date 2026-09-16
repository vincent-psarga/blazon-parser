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

/**
 * The tinctures that are a shade, which is every one but the furs.
 *
 * A colouring answers for these and no others. A fur is a figure rather than a
 * shade — an ermine spot is an ermine spot in every armorial, where the red of
 * gules is a convention and nothing more — so a fur is drawn rather than
 * painted, and what a colouring contributes to one is only the shades its
 * figures are cut from.
 */
export type Shade = Metals | Colours;

export const SHADES: readonly Shade[] = [...Object.values(Metals), ...Object.values(Colours)];

const FURS: ReadonlySet<string> = new Set(Object.values(Furs));

export function isFur(tincture: Tincture): tincture is Furs {
  return FURS.has(tincture);
}

export const TINCTURES: readonly Tincture[] = [
  ...Object.values(Metals),
  ...Object.values(Colours),
  ...Object.values(Furs),
];

export function isTincture(value: string): value is Tincture {
  return (TINCTURES as readonly string[]).includes(value);
}
