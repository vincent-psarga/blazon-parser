import { Link } from 'react-router';
import { DivisionType, VariationType, usualPieces } from '../../src/domain/models/Field';
import { OrdinaryType } from '../../src/domain/models/Ordinary';
import { Colours, Metals, TINCTURES } from '../../src/domain/models/Tinctures';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishTinctures } from '../../src/domain/translations/en/Tinctures';
import { EnglishDivisionType } from '../../src/domain/translations/en/Divisions';
import { EnglishVariationType } from '../../src/domain/translations/en/Variations';
import { EnglishOrdinaryType } from '../../src/domain/translations/en/Ordinaries';
import { BlazonShield } from '../components/BlazonShield';
import { COLOURINGS, OUTLINE } from '../utils/Colourings';

const DIVISIONS = Object.values(DivisionType);
const VARIATIONS = Object.values(VariationType);
const ORDINARIES = Object.values(OrdinaryType);

// A varied field is drawn in the pieces its term is understood to have, and the
// one no number is understood of is drawn in eight.
const PIECES = 8;

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
    note: 'The field cut in two along a line, and the same line taken over and over into a row of pieces. Each is cut from the same argent and gules.',
    arms: [
      ...DIVISIONS.map((type) => ({
        key: type,
        label: nameOf(EnglishDivisionType, type),
        blazon: { field: { type, firstTincture: Metals.argent, secondTincture: Colours.gules } },
      })),
      ...VARIATIONS.map((type) => ({
        key: type,
        label: nameOf(EnglishVariationType, type),
        blazon: {
          field: {
            type,
            firstTincture: Metals.argent,
            secondTincture: Colours.gules,
            pieces: usualPieces(type) ?? PIECES,
          },
        },
      })),
    ],
  },
  {
    path: '/doc/ordinaries',
    name: 'Ordinaries',
    note: 'Each borne gules on the same argent field, so the only thing that changes from one to the next is the band.',
    arms: ORDINARIES.map((type) => ({
      key: type,
      label: nameOf(EnglishOrdinaryType, type),
      blazon: {
        field: { tincture: Metals.argent },
        ordinaries: [{ type, tincture: Colours.gules }],
      },
    })),
  },
];

export function DocIndexPage() {
  return (
    <main className="plane">
      <h1>The vocabulary</h1>
      <p className="plane__extent">
        {TINCTURES.length} tinctures · {DIVISIONS.length} partitions · {VARIATIONS.length} varied
        fields · {ORDINARIES.length} ordinaries
      </p>
      <p className="plane__lead">
        Everything the parser reads, in French and in English. A blazon it accepts is a field — one
        tincture, or two divided by a line, or two alternating down a row of pieces — and whatever
        plain bands are laid over it, in the order they were laid. There are no other charges yet,
        and nothing here promises any.
      </p>

      <nav className="index" aria-label="Documentation">
        {PAGES.map(({ path, name, note, arms }) => (
          <Link key={path} to={path}>
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
          </Link>
        ))}
      </nav>
    </main>
  );
}
