import { FieldType, FurType } from '../../models/Field';
import { Translation } from '../Translation';
import { Word } from '../Word';

// English names a furred field by turning the fur into an adjective, as it turns
// a band into one — vair gives vairy, as the bend gives bendy — and it borrowed
// the French participle as well, writing it with the accent or without, so all
// three spellings are read and the English one is written back.
//
// This is the field's name and not the tincture's: "vair" alone is the fur in
// its own argent and azure, and is named in Tinctures.ts beside the others.
export const EnglishFurType: Translation<FurType> = {
  [FieldType.vairy]: [
    new Word(
      'vairy',
      'The bells of vair, cut from two tinctures the blazon names rather than from the argent and azure vair is always drawn in. Nothing is counted: a pelt is cut to no number of pieces. A vairy argent and azure would simply be vair, and is blazoned so.'
    ),
    new Word(
      'vairé',
      'The bells of vair, cut from two tinctures the blazon names rather than from the argent and azure vair is always drawn in. This is the French participle English borrowed whole, written with its accent or without it.',
      { alternateWording: { vaire: {} } }
    ),
  ],
};
