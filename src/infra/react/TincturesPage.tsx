import { Colours, Metals, Tincture } from '../../domain/models/Tinctures';
import { ColorModel } from '../../domain/services/IBlazonDrawer';
import { nameOf } from '../../domain/translations/Translation';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { BlazonShield } from './BlazonShield';

/**
 * The two ranks of tincture are kept apart because heraldry keeps them apart:
 * the rule of tincture forbids laying a metal on a metal, or a colour on a colour.
 */
const RANKS: readonly { readonly heading: string; readonly tinctures: readonly Tincture[] }[] = [
  { heading: 'Metals', tinctures: Object.values(Metals) },
  { heading: 'Colours', tinctures: Object.values(Colours) },
];

export interface TincturesPageProps {
  readonly colours?: ColorModel;
}

export function TincturesPage({ colours }: TincturesPageProps) {
  return (
    <main className="blazon-doc">
      <h1>Tinctures</h1>
      <p className="blazon-doc-lead">
        The tinctures a field may be painted with, and what each is called in either language. The
        shades are a convention: heraldry fixes no hue, only which tincture is meant.
      </p>

      {RANKS.map(({ heading, tinctures }) => (
        <section key={heading} aria-labelledby={`rank-${heading}`}>
          <h2 id={`rank-${heading}`}>{heading}</h2>
          <ul className="blazon-gallery">
            {tinctures.map((tincture) => (
              <li key={tincture}>
                <BlazonShield
                  blazon={{ field: { tincture } }}
                  alt={nameOf(EnglishTinctures, tincture)}
                  colours={colours}
                  width={96}
                />
                <dl>
                  <dt>Français</dt>
                  <dd>{nameOf(FrenchTinctures, tincture)}</dd>
                  <dt>English</dt>
                  <dd>{nameOf(EnglishTinctures, tincture)}</dd>
                </dl>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
