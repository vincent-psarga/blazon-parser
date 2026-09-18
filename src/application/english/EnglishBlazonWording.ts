import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { EnglishFurType } from '../../domain/translations/en/Furs';
import { EnglishChargeType } from '../../domain/translations/en/Charges';
import { EnglishStrewings, OF as SOWN_OF, SOWN } from '../../domain/translations/en/Strewings';
import { EnglishNumbers } from '../../domain/translations/en/Numbers';
import { EnglishOrdinaryType } from '../../domain/translations/en/Ordinaries';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { EnglishVariationType, OF } from '../../domain/translations/en/Variations';
import { BlazonWording } from '../writer/BlazonWording';
import { CONJUNCTION, bearing } from './EnglishGrammar';

export const EnglishBlazonWording: BlazonWording = {
  tinctures: EnglishTinctures,
  divisions: EnglishDivisionType,
  variations: EnglishVariationType,
  furs: EnglishFurType,
  ordinaries: EnglishOrdinaryType,
  charges: EnglishChargeType,
  strewings: EnglishStrewings,
  numbers: EnglishNumbers,
  // English names a tincture bare: "Azure.", "Per pale azure and or."
  introduce: (word) => word.value,
  bear: bearing,
  // English counts the pieces of a varied field wherever it can: Greaves' Guide
  // to Blazonry, published by the Royal Heraldry Society of Canada, uses "terms
  // like 'barry', 'paly' and 'bendy', always stating the number and the tinctures
  // involved". So the usual number is written like any other and nothing is left
  // to be understood.
  vary: (word, tinctures, pieces) => `${word.value} ${OF} ${pieces} ${tinctures}`,
  // "semy of billets": the English spelling of the participle, though both it
  // and the French one are read.
  strew: (word) => `${SOWN[0].value} ${SOWN_OF} ${word.plural}`,
  conjunction: CONJUNCTION,
};
