import { Colours, Metals, Tincture } from '../../models/Tinctures';
import { Translation } from '../Translation';

export const EnglishMetals: Translation<Metals> = {
  [Metals.or]: 'or',
  [Metals.argent]: 'argent',
};

export const EnglishColours: Translation<Colours> = {
  [Colours.azure]: 'azure',
  [Colours.gules]: 'gules',
  [Colours.sable]: 'sable',
  [Colours.vert]: 'vert',
};

export const EnglishTinctures: Translation<Tincture> = { ...EnglishMetals, ...EnglishColours };
