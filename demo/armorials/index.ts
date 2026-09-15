import { Armorial } from '../../src/domain/models/Armorial';
import { FrancheComteArmorial } from './franche-comte';
import { SampleArmorial } from './sample';
import { TableRondeArmorial } from './table-ronde';

/**
 * The armorials the demo carries, in the order it shows them. They belong to the
 * demo rather than to the library: the library reads an armorial, it holds none.
 */
export const ARMORIALS: readonly Armorial[] = [
  SampleArmorial,
  FrancheComteArmorial,
  TableRondeArmorial,
];
