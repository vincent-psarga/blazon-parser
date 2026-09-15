import { OrdinaryType } from '../../models/Ordinary';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

// French names the band itself, where it names a partition after the line that
// cuts the field: "coupé" divides, "fasce" is laid on. The two diagonals are the
// bande and the barre, which is the pair "tranché" and "taillé" divide along.
//
// Gender is what the article agrees with — "à la fasce", "au chevron" — so each
// name carries it.
export const FrenchOrdinaryType: Translation<OrdinaryType, FrenchWord> = {
  [OrdinaryType.chief]: new FrenchWord('chef'),
  [OrdinaryType.pale]: new FrenchWord('pal'),
  [OrdinaryType.fess]: new FrenchWord('fasce', { isFeminine: true }),
  [OrdinaryType.barGemel]: new FrenchWord('jumelle', { isFeminine: true }),
  [OrdinaryType.bend]: new FrenchWord('bande', { isFeminine: true }),
  [OrdinaryType.bendSinister]: new FrenchWord('barre', { isFeminine: true }),
  [OrdinaryType.chevron]: new FrenchWord('chevron'),
  [OrdinaryType.cross]: new FrenchWord('croix', { isFeminine: true, plural: 'croix' }),
  [OrdinaryType.saltire]: new FrenchWord('sautoir'),
  [OrdinaryType.bordure]: new FrenchWord('bordure', { isFeminine: true }),
};
