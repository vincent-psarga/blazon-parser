import { Blazon } from '../../src/domain/models/Blazon';
import { ChargeType } from '../../src/domain/models/Charge';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishChargeType } from '../../src/domain/translations/en/Charges';
import { FrenchChargeType } from '../../src/domain/translations/fr/Charges';
import { EnglishBlazonWriter } from '../../src/application/writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from '../../src/application/writer/FrenchBlazonWriter';
import { Colouring } from '../utils/Colourings';
import {
  Reference,
  ReferenceEntry,
  ReferenceRank,
  ReferenceVariants,
} from '../components/Reference';

// Every charge is borne on the same field in the same tincture, so that what
// changes from one to the next is the shape and nothing else.
const FIELD = Metals.argent;
const BORNE = Colours.gules;

const inFrench = new FrenchBlazonWriter();
const inEnglish = new EnglishBlazonWriter();

const GLOSS: Record<ChargeType, string> = {
  [ChargeType.annulet]:
    'A plain ring. What it encloses is the field showing through, not its own tincture, which is what makes it an annulet rather than a roundel.',
  [ChargeType.billet]:
    'An upright rectangle, twice as tall as it is wide. The name is the little billet — a note, or a log — and French says billette.',
  [ChargeType.lozenge]:
    'A diamond standing on one of its points, taller than it is wide. Set square it would be a square; laid on its side it would be something else again.',
};

// Two and three, which is enough to show what a count does to the drawing: the
// charges shrink, and arrange themselves — three are two in chief and one in
// base, which is what heraldry does when nothing says otherwise.
const COUNTS: readonly (readonly [string, number])[] = [
  ['Twice', 2],
  ['Thrice', 3],
];

const armsOf = (type: ChargeType, count?: number): Blazon => ({
  field: { tincture: FIELD },
  chargesOrOrdinaries: [
    count === undefined ? { type, tincture: BORNE } : { type, tincture: BORNE, count },
  ],
});

/** The same charge borne twice and thrice. Every charge may be borne in number. */
function inNumber(type: ChargeType): ReferenceVariants {
  return {
    heading: 'Borne in number',
    entries: COUNTS.map(([label, count]) => {
      const blazon = armsOf(type, count);
      return {
        label,
        blazon,
        inFrench: inFrench.write(blazon),
        inEnglish: inEnglish.write(blazon),
      };
    }),
  };
}

function entry(type: ChargeType): ReferenceEntry {
  const blazon = armsOf(type);
  return {
    term: type,
    english: nameOf(EnglishChargeType, type),
    french: nameOf(FrenchChargeType, type),
    gloss: GLOSS[type],
    blazon,
    inFrench: inFrench.write(blazon),
    inEnglish: inEnglish.write(blazon),
    variants: inNumber(type),
  };
}

const RANKS: readonly ReferenceRank[] = [
  {
    heading: 'Charges',
    law: 'Each is borne gules on the same argent field, so the only thing that changes from one to the next is the figure itself. Any of them may be borne in number.',
    entries: Object.values(ChargeType).map(entry),
  },
];

export interface ChargesPageProps {
  readonly colourings?: readonly Colouring[];
}

export function ChargesPage({ colourings }: ChargesPageProps) {
  return (
    <Reference
      title="Charges"
      extent="Three charges"
      lead={
        <>
          <p className="plane__lead">
            The figures a field bears that follow no line across it. An ordinary takes its place and
            its size from the line it is named after; a charge is named after the thing it is a
            picture of, and is simply set on the field — as many times as the blazon says.
          </p>
          <p className="plane__lead">
            Where they stand is the disposition, which a blazon may name and which is not read yet.
            A count with no disposition is laid out two abreast, the odd one last: three are two in
            chief and one in base, as an armorial draws them.
          </p>
          <p className="plane__lead">
            A charge and a band are laid on the field by the same phrase, and in the order the
            blazon names them: a bend blazoned after a billet covers it, and blazoned before it is
            covered by it.
          </p>
          <p className="plane__lead">Choose any term to read it at full size.</p>
        </>
      }
      ranks={RANKS}
      colourings={colourings}
    />
  );
}
