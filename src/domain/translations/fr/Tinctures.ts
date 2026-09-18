import { Colours, Furs, Metals, Tincture } from '../../models/Tinctures';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

export const FrenchMetals: Translation<Metals, FrenchWord> = {
  [Metals.or]: new FrenchWord(
    'or',
    'Gold, and never the conjunction the same three letters spell.'
  ),
  [Metals.argent]: new FrenchWord(
    'argent',
    'Silver, or plain white. It carries no hatching at all: the bare paper is the metal.'
  ),
};

export const FrenchColours: Translation<Colours, FrenchWord> = {
  [Colours.azure]: new FrenchWord('azur', 'Blue.'),
  [Colours.gules]: new FrenchWord(
    'gueules',
    'Red. From the fur-trimmed throat of a garment, not from any word for red.'
  ),
  [Colours.sable]: new FrenchWord('sable', 'Black.'),
  [Colours.vert]: new FrenchWord('sinople', 'Green.'),
};

export const FrenchFurs: Translation<Furs, FrenchWord> = {
  // The h of hermine is mute, so "de" elides before it as it would before a vowel.
  [Furs.ermine]: new FrenchWord(
    'hermine',
    'A white pelt strewn with black tails. Its h is mute, so the article elides before it: d’hermine.',
    { isFeminine: true, needsElision: true }
  ),
  [Furs.vair]: new FrenchWord(
    'vair',
    'Squirrel fur, argent and azure, cut into bells and set in alternating rows. It carries its pair with it: a blazon naming it names no tinctures after it.'
  ),
};

export const FrenchTinctures: Translation<Tincture, FrenchWord> = {
  ...FrenchMetals,
  ...FrenchColours,
  ...FrenchFurs,
};
