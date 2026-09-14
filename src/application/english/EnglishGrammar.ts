import { keyword } from '../parser/Combinators';

// English plumbing, not heraldry: what holds a blazon together between the terms.
// English names a tincture bare — "Azure." — so there is no article to agree with.

/** The conjunction joining the halves of a divided field. */
export const CONJUNCTION = 'and';

export const AND = keyword(CONJUNCTION);

/**
 * What says the field bears an ordinary rather than is divided by one: English
 * spells the partition "per fess" and the band "a fess", so the article carries
 * the whole distinction.
 *
 * "an" is not accepted, and is not yet needed: no ordinary in the vocabulary
 * begins with a vowel.
 */
export const INDEFINITE_ARTICLE = 'a';

export const A = keyword(INDEFINITE_ARTICLE);
