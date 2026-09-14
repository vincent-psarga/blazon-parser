import { OrdinaryType } from '../../models/Ordinary';
import { Translation } from '../Translation';

// English names the ordinary with the same word it uses for the line, and tells
// the two apart by what precedes it: "per fess" divides, "a fess" is laid on.
export const EnglishOrdinaryType: Translation<OrdinaryType> = {
  [OrdinaryType.chief]: 'chief',
  [OrdinaryType.pale]: 'pale',
  [OrdinaryType.fess]: 'fess',
  [OrdinaryType.bend]: 'bend',
  [OrdinaryType.bendSinister]: 'bend sinister',
  [OrdinaryType.chevron]: 'chevron',
  [OrdinaryType.cross]: 'cross',
  [OrdinaryType.saltire]: 'saltire',
};
