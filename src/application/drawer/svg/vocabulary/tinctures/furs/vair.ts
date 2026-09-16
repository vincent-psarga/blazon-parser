import { Colours, Metals } from '../../../../../../domain/models/Tinctures';
import { vairy } from '../../coverings/furred/vairy';
import { FurTincture } from './FurTincture';

/**
 * Vairy of argent and azure, which is what vair is: the tincture carries its
 * pair with it and names no other, where a vairé is owed the pair it is cut
 * from.
 */
export const vair: FurTincture = {
  pelt: vairy,
  from: [Metals.argent, Colours.azure],
};
