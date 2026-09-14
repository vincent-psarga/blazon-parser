import { Armorial } from '../../src/domain/models/Armorial';
import { SampleArmorial } from './sample';

/**
 * The armorials the demo carries, in the order it shows them. They belong to the
 * demo rather than to the library: the library reads an armorial, it holds none.
 */
export const ARMORIALS: readonly Armorial[] = [SampleArmorial];
