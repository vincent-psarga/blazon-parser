import { Colours, Furs, Metals, Tincture } from '../../models/Tinctures';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

export const FrenchMetals: Translation<Metals, FrenchWord> = {
  [Metals.or]: new FrenchWord('or'),
  [Metals.argent]: new FrenchWord('argent'),
};

export const FrenchColours: Translation<Colours, FrenchWord> = {
  [Colours.azure]: new FrenchWord('azur'),
  [Colours.gules]: new FrenchWord('gueules'),
  [Colours.sable]: new FrenchWord('sable'),
  [Colours.vert]: new FrenchWord('sinople'),
};

export const FrenchFurs: Translation<Furs, FrenchWord> = {
  // The h of hermine is mute, so "de" elides before it as it would before a vowel.
  [Furs.ermine]: new FrenchWord('hermine', { isFeminine: true, needsElision: true }),
  [Furs.vair]: new FrenchWord('vair'),
};

export const FrenchTinctures: Translation<Tincture, FrenchWord> = {
  ...FrenchMetals,
  ...FrenchColours,
  ...FrenchFurs,
};
