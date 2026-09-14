import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { BlazonWording } from '../writer/BlazonWording';
import { CONJUNCTION, withArticle } from './FrenchGrammar';

export const FrenchBlazonWording: BlazonWording = {
  tinctures: FrenchTinctures,
  divisions: FrenchDivisionType,
  introduce: withArticle,
  conjunction: CONJUNCTION,
};
