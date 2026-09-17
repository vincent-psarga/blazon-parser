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
