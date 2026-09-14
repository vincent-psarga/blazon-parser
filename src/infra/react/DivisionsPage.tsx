import { DivisionType } from '../../domain/models/Field';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { ColorModel } from '../../domain/services/IBlazonDrawer';
import { nameOf } from '../../domain/translations/Translation';
import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { EnglishBlazonWriter } from '../../application/writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from '../../application/writer/FrenchBlazonWriter';
import { BlazonShield } from './BlazonShield';

// Every partition is shown cut from the same two tinctures, so that what changes
// between one shield and the next is the line of division and nothing else.
const FIRST = Metals.argent;
const SECOND = Colours.gules;

const inFrench = new FrenchBlazonWriter();
const inEnglish = new EnglishBlazonWriter();

export interface DivisionsPageProps {
  readonly colours?: ColorModel;
}

export function DivisionsPage({ colours }: DivisionsPageProps) {
  return (
    <main className="blazon-doc">
      <h1>Divisions</h1>
      <p className="blazon-doc-lead">
        The lines a field may be divided along, each shown argent and gules. The first tincture
        named takes the half in chief.
      </p>

      <ul className="blazon-gallery">
        {Object.values(DivisionType).map((type) => {
          const blazon = { field: { type, firstTincture: FIRST, secondTincture: SECOND } };
          return (
            <li key={type}>
              <BlazonShield
                blazon={blazon}
                alt={inEnglish.write(blazon)}
                colours={colours}
                width={96}
              />
              <dl>
                <dt>Français</dt>
                <dd>{nameOf(FrenchDivisionType, type)}</dd>
                <dt>English</dt>
                <dd>{nameOf(EnglishDivisionType, type)}</dd>
              </dl>
              <p className="blazon-doc-example">
                <span lang="fr">{inFrench.write(blazon)}</span>
                <span lang="en">{inEnglish.write(blazon)}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
