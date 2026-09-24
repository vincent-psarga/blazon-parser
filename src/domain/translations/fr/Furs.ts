import { FieldType, FurType } from '../../models/Field';
import { blasonArmoiries } from '../Sources';
import { Translation } from '../Translation';
import { FrenchWord } from './FrenchWord';

// French names a furred field with the past participle of the fur, as it names a
// varied one with the participle of the band it repeats: the vair gives vairé.
//
// This is the field's name and not the tincture's — "de vair" is a field of the
// fur itself, argent and azure, where "vairé" is owed the two tinctures its
// bells are cut from. The tincture is named in Tinctures.ts beside the others.
//
// Nothing here agrees with an article: the name opens the blazon and stands
// alone before the tinctures it alternates, as a varied field's does.
export const FrenchFurType: Translation<FurType, FrenchWord> = {
  [FieldType.vairy]: new FrenchWord('vairé', {
    value:
      'The bells of vair, cut from two tinctures the blazon names rather than from the argent and azure vair is always drawn in. Nothing is counted: a pelt is cut to no number of pieces. A vairé d’argent et d’azur would simply be vair, and is blazoned so.',
    sources: [blasonArmoiries('Vairé')],
  }),
};
