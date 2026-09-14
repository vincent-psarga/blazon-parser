import { DivisionType } from '../../domain/models/Field';
import { Colours, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { nameOf } from '../../domain/translations/Translation';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { BlazonShield } from './BlazonShield';
import { COLOURINGS, OUTLINE } from './Colourings';

export interface DocIndexPageProps {
  /** How the host routes to a documentation page. */
  readonly onGo?: (path: string) => void;
}

const DIVISIONS = Object.values(DivisionType);

// An index of a closed set shows the set. Two links in an empty half-screen
// index nothing.
const PAGES = [
  {
    path: '/doc/tinctures',
    name: 'Tinctures',
    note: 'Three ranks, each named in both tongues, and each shown in colour beside the hatching that stands in for it.',
    arms: TINCTURES.map((tincture) => ({
      key: tincture,
      label: nameOf(EnglishTinctures, tincture),
      blazon: { field: { tincture } },
    })),
  },
  {
    path: '/doc/divisions',
    name: 'Divisions',
    note: 'Each cut from the same argent and gules, so the only thing that changes from one to the next is the line.',
    arms: DIVISIONS.map((type) => ({
      key: type,
      label: nameOf(EnglishDivisionType, type),
      blazon: { field: { type, firstTincture: Metals.argent, secondTincture: Colours.gules } },
    })),
  },
];

export function DocIndexPage({ onGo }: DocIndexPageProps) {
  return (
    <main className="plane">
      <h1>The vocabulary</h1>
      <p className="plane__extent">
        {TINCTURES.length} tinctures · {DIVISIONS.length} partitions
      </p>
      <p className="plane__lead">
        Everything the parser reads, in French and in English. A blazon it accepts is a field: one
        tincture, or two divided by a line. There are no charges or ordinaries yet, and nothing here
        promises any.
      </p>

      <nav className="index" aria-label="Documentation">
        {PAGES.map(({ path, name, note, arms }) => (
          <a
            key={path}
            href={path}
            onClick={(event) => {
              if (onGo !== undefined) {
                event.preventDefault();
                onGo(path);
              }
            }}
          >
            <span className="index__name">{name}</span>
            <p className="index__note">{note}</p>
            <span className="index__set">
              {arms.map(({ key, label, blazon }) => (
                <span key={key} className="index__arm" title={label}>
                  <BlazonShield
                    blazon={blazon}
                    alt=""
                    colours={COLOURINGS[0]?.colours}
                    outline={OUTLINE}
                    width={56}
                  />
                </span>
              ))}
            </span>
          </a>
        ))}
      </nav>
    </main>
  );
}
