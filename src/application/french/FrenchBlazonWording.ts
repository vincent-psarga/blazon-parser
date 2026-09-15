import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { FrenchOrdinaryType } from '../../domain/translations/fr/Ordinaries';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { FrenchWord } from '../../domain/translations/fr/FrenchWord';
import { BlazonWording } from '../writer/BlazonWording';
import { CONJUNCTION, bearing, withArticle } from './FrenchGrammar';

export const FrenchBlazonWording: BlazonWording<FrenchWord> = {
  tinctures: FrenchTinctures,
  divisions: FrenchDivisionType,
  ordinaries: FrenchOrdinaryType,
  introduce: withArticle,
  bear: bearing,
  conjunction: CONJUNCTION,
};
