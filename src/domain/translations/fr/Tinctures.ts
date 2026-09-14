import { Colours, Metals, Tincture } from '../../models/Tinctures';
import { Translation } from '../Translation';

export const FrenchMetals: Translation<Metals> = {
  [Metals.gold]: 'or',
  [Metals.silver]: 'argent',
};

export const FrenchColours: Translation<Colours> = {
  [Colours.azure]: 'azur',
  [Colours.gules]: 'gueules',
  [Colours.sable]: 'sable',
  [Colours.vert]: 'sinople',
};

export const FrenchTinctures: Translation<Tincture> = { ...FrenchMetals, ...FrenchColours };
