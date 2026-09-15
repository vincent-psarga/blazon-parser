import { OrdinaryType } from '../../models/Ordinary';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English names the ordinary with the same word it uses for the line, and tells
// the two apart by what precedes it: "per fess" divides, "a fess" is laid on.
export const EnglishOrdinaryType: Translation<OrdinaryType> = {
  [OrdinaryType.chief]: new Word('chief'),
  [OrdinaryType.pale]: new Word('pale'),
  [OrdinaryType.fess]: new Word('fess', { plural: 'fesses' }),
  [OrdinaryType.bend]: new Word('bend'),
  // The adjective follows the noun, so it is the noun that takes the plural.
  [OrdinaryType.bendSinister]: new Word('bend sinister', { plural: 'bends sinister' }),
  [OrdinaryType.chevron]: new Word('chevron'),
  [OrdinaryType.cross]: new Word('cross', { plural: 'crosses' }),
  [OrdinaryType.saltire]: new Word('saltire'),
};
