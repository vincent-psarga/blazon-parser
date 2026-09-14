import { DivisionType } from '../../domain/models/Field';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { nameOf } from '../../domain/translations/Translation';
import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { EnglishBlazonWriter } from '../../application/writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from '../../application/writer/FrenchBlazonWriter';
import { Colouring } from './Colourings';
import { Reference, ReferenceEntry, ReferenceRank } from './Reference';

// Every partition is cut from the same two tinctures, so that what changes from
// one to the next is the line of division and nothing else.
const FIRST = Metals.argent;
const SECOND = Colours.gules;

const inFrench = new FrenchBlazonWriter();
const inEnglish = new EnglishBlazonWriter();

const GLOSS: Record<DivisionType, string> = {
  [DivisionType.pale]: 'Cut straight down the middle, along the line a pale would occupy.',
  [DivisionType.fess]:
    'Cut straight across. The first tincture named takes the chief, the upper half.',
  [DivisionType.bend]:
    'Cut from dexter chief to sinister base — from the top left, as you look at it.',
  [DivisionType.bendSinister]:
    'The mirror of a bend, from sinister chief. Sinister means the bearer’s left, never yours.',
};

function entry(type: DivisionType): ReferenceEntry {
  const blazon = { field: { type, firstTincture: FIRST, secondTincture: SECOND } };
  return {
    term: type,
    french: nameOf(FrenchDivisionType, type),
    english: nameOf(EnglishDivisionType, type),
    reference: type,
    gloss: GLOSS[type],
    blazon,
    inFrench: inFrench.write(blazon),
    inEnglish: inEnglish.write(blazon),
  };
}

const RANKS: readonly ReferenceRank[] = [
  {
    heading: 'Partitions',
    law: 'Each is shown argent and gules, so the only thing that changes from one to the next is the line itself.',
    entries: Object.values(DivisionType).map(entry),
  },
];

export interface DivisionsPageProps {
  readonly colourings?: readonly Colouring[];
  readonly onTry?: (blazon: string) => void;
}

export function DivisionsPage({ colourings, onTry }: DivisionsPageProps) {
  return (
    <Reference
      title="Divisions"
      extent="Four partitions · all the parser reads"
      lead={
        <>
          <p className="plane__lead">
            The lines a field may be divided along. The first tincture named always takes the half
            in chief, so the order of the words decides which side is which.
          </p>
          <p className="plane__lead">Choose any term to read it at full size.</p>
        </>
      }
      ranks={RANKS}
      colourings={colourings}
      onTry={onTry}
    />
  );
}
