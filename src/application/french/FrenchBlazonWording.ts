import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { FrenchFurType } from '../../domain/translations/fr/Furs';
import { FrenchNumbers } from '../../domain/translations/fr/Numbers';
import { FrenchOrdinaryType } from '../../domain/translations/fr/Ordinaries';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { FrenchVariationType } from '../../domain/translations/fr/Variations';
import { FrenchWord } from '../../domain/translations/fr/FrenchWord';
import { BlazonWording } from '../writer/BlazonWording';
import { CONJUNCTION, bearing, cutIn, withArticle } from './FrenchGrammar';

export const FrenchBlazonWording: BlazonWording<FrenchWord> = {
  tinctures: FrenchTinctures,
  divisions: FrenchDivisionType,
  variations: FrenchVariationType,
  furs: FrenchFurType,
  ordinaries: FrenchOrdinaryType,
  numbers: FrenchNumbers,
  introduce: withArticle,
  bear: bearing,
  vary: cutIn,
  conjunction: CONJUNCTION,
};
