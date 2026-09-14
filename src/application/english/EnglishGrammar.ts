import { keyword } from '../parser/Combinators';

// English plumbing, not heraldry: what holds a blazon together between the terms.
// English names a tincture bare — "Azure." — so there is no article to agree with.

/** The conjunction joining the halves of a divided field. */
export const CONJUNCTION = 'and';

export const AND = keyword(CONJUNCTION);
