import { Colours, Furs, Metals, Tincture } from '../../models/Tinctures';
import { Translation } from '../Translation';
import { Word } from '../Word';

export const EnglishMetals: Translation<Metals> = {
  [Metals.or]: new Word('or'),
  [Metals.argent]: new Word('argent'),
};

export const EnglishColours: Translation<Colours> = {
  [Colours.azure]: new Word('azure'),
  [Colours.gules]: new Word('gules'),
  [Colours.sable]: new Word('sable'),
  [Colours.vert]: new Word('vert'),
};

export const EnglishFurs: Translation<Furs> = {
  [Furs.ermine]: new Word('ermine'),
  [Furs.vair]: new Word('vair'),
};

export const EnglishTinctures: Translation<Tincture> = {
  ...EnglishMetals,
  ...EnglishColours,
  ...EnglishFurs,
};
