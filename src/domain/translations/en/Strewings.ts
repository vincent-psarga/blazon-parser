import { ChargeType } from '../../models/Charge';
import { Metals } from '../../models/Tinctures';
import { Strewings } from '../Strewings';
import { Word } from '../Word';

/**
 * English names a strewing by turning the figure it sows into an adjective —
 * billetty from the billet, bezanty from the bezant — which is the same move
 * French makes with its participles, arrived at from the other end.
 *
 * The bezant carries its tincture into the strewing as it carries it into the
 * charge: a bezanty field is gold-sown by being bezanty, and a field sown with
 * silver discs is no bezanty but a field semy of plates. English named no
 * adjective for the plate, so that one is sown in as many words.
 *
 * The annulet and the lozenge have none either. "Lozengy" is a field cut into
 * lozenges rather than sown with them, and is a varied field in its own right —
 * not this, and not to be borrowed for it.
 */
export const EnglishStrewings: Strewings = {
  [ChargeType.annulet]: undefined,
  [ChargeType.billet]: new Word('billetty'),
  [ChargeType.lozenge]: undefined,
  [ChargeType.roundel]: new Word('bezanty', { defaultTincture: Metals.or }),
  // A field sown with drops has a word — gutté, gutty — and the word does not
  // take a tincture. Parker names the liquid instead: "when argent, gutté d'eau
  // ... when gules, gutté de sang", which is a second vocabulary of waters and
  // bloods and pitches that nothing here reads. So a sown goutte is sown in as
  // many words, where "gutty argent" would be a form no armorial writes.
  [ChargeType.goutte]: undefined,
  [ChargeType.mullet]: undefined,
  // The arms of France before they were reduced to three, and the one strewing
  // English names after the figure rather than after an adjective made of it.
  // Crusily is not this. Parker has it as "semé of cross crosslet" — the cross
  // with crossed arms — so a field sown with plain ones is no crusily, and
  // borrowing the word would promise a figure this does not draw.
  [ChargeType.crossCouped]: undefined,
  [ChargeType.crescent]: undefined,
  [ChargeType.fleurDeLis]: [
    new Word('semy-de-lis'),
    new Word('semy-de-lys'),
    new Word('semé-de-lis'),
    new Word('semy de lis'),
  ],
};

/**
 * How English says a field is sown with a figure it has no word of its own for.
 *
 * Parker writes the French participle and notes it is "sometimes written semy";
 * the English spelling is the one written back out, and both are read.
 */
export const SOWN: readonly string[] = ['semy', 'semé', 'semee'];

/** What stands between the sowing and the figure sown: "semy of billets". */
export const OF = 'of';
