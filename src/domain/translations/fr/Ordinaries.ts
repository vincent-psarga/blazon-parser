import { OrdinaryType } from '../../models/Ordinary';
import { Translation } from '../Translation';

// French names the band itself, where it names a partition after the line that
// cuts the field: "coupé" divides, "fasce" is laid on. The two diagonals are the
// bande and the barre, which is the pair "tranché" and "taillé" divide along.
export const FrenchOrdinaryType: Translation<OrdinaryType> = {
  [OrdinaryType.chief]: 'chef',
  [OrdinaryType.pale]: 'pal',
  [OrdinaryType.fess]: 'fasce',
  [OrdinaryType.bend]: 'bande',
  [OrdinaryType.bendSinister]: 'barre',
  [OrdinaryType.chevron]: 'chevron',
  [OrdinaryType.cross]: 'croix',
  [OrdinaryType.saltire]: 'sautoir',
};
