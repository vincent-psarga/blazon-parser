export const METALS = ['or', 'argent'] as const;

export const COLOURS = ['azur', 'gueules', 'sable', 'sinople'] as const;

export const TINCTURES = [...METALS, ...COLOURS] as const;

export type Tincture = (typeof TINCTURES)[number];

export function isTincture(value: string): value is Tincture {
  return (TINCTURES as readonly string[]).includes(value);
}
