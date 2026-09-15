import { OrdinaryType } from '../../models/Ordinary';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English names the ordinary with the same word it uses for the line, and tells
// the two apart by what precedes it: "per fess" divides, "a fess" is laid on.
export const EnglishOrdinaryType: Translation<OrdinaryType> = {
  [OrdinaryType.chief]: new Word('chief'),
  [OrdinaryType.pale]: new Word('pale'),
  [OrdinaryType.fess]: new Word('fess', { plural: 'fesses' }),
  // Gemel is the adjective — twinned — so again it is the noun that pluralises.
  [OrdinaryType.barGemel]: new Word('bar gemel', { plural: 'bars gemel' }),
  [OrdinaryType.bend]: new Word('bend'),
  // The adjective follows the noun, so it is the noun that takes the plural.
  [OrdinaryType.bendSinister]: new Word('bend sinister', { plural: 'bends sinister' }),
  [OrdinaryType.chevron]: new Word('chevron'),
  [OrdinaryType.cross]: new Word('cross', { plural: 'crosses' }),
  [OrdinaryType.saltire]: new Word('saltire'),
  // English blazon keeps the French spelling for this one, though the plain
  // border is the same word and is read too — and written back as the bordure.
  [OrdinaryType.bordure]: [new Word('bordure'), new Word('border')],
};
