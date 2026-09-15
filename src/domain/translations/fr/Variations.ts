import { VariationType } from '../../models/Field';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

// French names a varied field with the past participle of the band it repeats —
// "fascé" from the fasce, "bandé" from the bande — so the word is the ordinary's
// rather than the partition's: a field cut in six along the line of the bande is
// bandé, where one cut in two along it is tranché.
//
// The pily has no band behind it: an émanche is the long triangle itself, and a
// field sown with them is émanché.
//
// Nothing here agrees with an article: a varied field opens the blazon, and the
// name stands alone before the tinctures it alternates.
export const FrenchVariationType: Translation<VariationType, FrenchWord> = {
  [VariationType.barry]: new FrenchWord('fascé'),
  [VariationType.paly]: new FrenchWord('palé'),
  [VariationType.bendy]: new FrenchWord('bandé'),
  [VariationType.pily]: new FrenchWord('émanché'),
  [VariationType.chevronny]: new FrenchWord('chevronné'),
};

/** What French calls the equal parts a varied field is cut into. */
export const PIECES = 'pièces';
