import { FieldType, VariationType } from '../../models/Field';
import { blasonArmoiries } from '../Sources';
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
  [FieldType.barry]: new FrenchWord('fascé', {
    value:
      'The line of a fasce taken over and over: the field cut across into equal bars of two tinctures laid alternately.',
    sources: [blasonArmoiries('Fascé', 'fascee')],
  }),
  [FieldType.paly]: new FrenchWord('palé', {
    value:
      'The line of a pal taken over and over: the field cut down into equal upright pieces of two tinctures laid alternately. The first tincture takes the piece at dexter, the viewer’s left.',
    sources: [blasonArmoiries('Palé')],
  }),
  [FieldType.bendy]: new FrenchWord('bandé', {
    value:
      'The line of a bande repeated, corner to corner. The first tincture takes the piece against the dexter chief corner, which is how the armorials draw it.',
    sources: [blasonArmoiries('Bandé', 'bandee')],
  }),
  [FieldType.pily]: new FrenchWord('émanché', {
    value:
      'Not a line repeated but a rank of long triangles driven into each other point first: émanches from the chief, and émanches from the base between them, each driven into the gaps the others leave.',
    sources: [blasonArmoiries('Émanché', 'emanchee')],
  }),
  [FieldType.chevronny]: new FrenchWord('chevronné', {
    value: 'The chevron repeated down the field, each piece bent to the same point.',
    sources: [blasonArmoiries('Chevronné')],
  }),
};

/** What French calls the equal parts a varied field is cut into. */
export const PIECES = 'pièces';
