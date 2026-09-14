import { Colours, Metals, Tincture } from '../../models/Tinctures';
import { Translation } from '../Translation';

export const EnglishMetals: Translation<Metals> = {
  [Metals.gold]: 'or',
  [Metals.silver]: 'argent',
};

export const EnglishColours: Translation<Colours> = {
  [Colours.azure]: 'azure',
  [Colours.gules]: 'gules',
  [Colours.sable]: 'sable',
  [Colours.vert]: 'vert',
};

export const EnglishTinctures: Translation<Tincture> = { ...EnglishMetals, ...EnglishColours };
