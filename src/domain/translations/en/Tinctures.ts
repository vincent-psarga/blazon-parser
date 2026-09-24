import { Colours, Furs, Metals, Tincture } from '../../models/Tinctures';
import { Translation } from '../Translation';
import { Word } from '../Word';

export const EnglishMetals: Translation<Metals> = {
  [Metals.or]: new Word(
    'or',
    'Gold, painted yellow. The French for gold, and never the conjunction the same two letters spell.'
  ),
  [Metals.argent]: new Word(
    'argent',
    'Silver, or plain white. It carries no hatching at all: the bare paper is the metal.'
  ),
};

export const EnglishColours: Translation<Colours> = {
  [Colours.azure]: new Word('azure', 'Blue.'),
  [Colours.gules]: new Word(
    'gules',
    'Red. From the fur-trimmed throat of a garment, not from any word for red.'
  ),
  [Colours.sable]: new Word('sable', 'Black.'),
  [Colours.vert]: new Word('vert', 'Green.'),
};

export const EnglishFurs: Translation<Furs> = {
  [Furs.ermine]: new Word('ermine', 'A white pelt strewn with black tails.'),
  [Furs.vair]: new Word(
    'vair',
    'Squirrel fur, argent and azure, cut into bells and set in alternating rows. It carries its pair with it: a blazon naming it names no tinctures after it.'
  ),
};

export const EnglishTinctures: Translation<Tincture> = {
  ...EnglishMetals,
  ...EnglishColours,
  ...EnglishFurs,
};
