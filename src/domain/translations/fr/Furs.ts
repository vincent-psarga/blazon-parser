import { FurType } from '../../models/Field';
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
  [FurType.vairy]: new FrenchWord('vairé'),
};
