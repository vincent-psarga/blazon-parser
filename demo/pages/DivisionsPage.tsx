import { Blazon } from '../../src/domain/models/Blazon';
import { DivisionType, VariationType, usualPieces } from '../../src/domain/models/Field';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { counted } from '../../src/domain/translations/Numbers';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishDivisionType } from '../../src/domain/translations/en/Divisions';
import { EnglishNumbers } from '../../src/domain/translations/en/Numbers';
import { EnglishVariationType } from '../../src/domain/translations/en/Variations';
import { FrenchDivisionType } from '../../src/domain/translations/fr/Divisions';
import { FrenchVariationType } from '../../src/domain/translations/fr/Variations';
import { EnglishBlazonWriter } from '../../src/application/writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from '../../src/application/writer/FrenchBlazonWriter';
import { Colouring } from '../utils/Colourings';
import {
  Reference,
  ReferenceEntry,
  ReferenceRank,
  ReferenceVariants,
} from '../components/Reference';

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

/**
 * What each varied field is, said plainly.
 *
 * Keyed on VariationType, so a varied field added to the vocabulary breaks the
 * page until someone says what it looks like.
 */
const VARIED_GLOSS: Record<VariationType, string> = {
  [VariationType.barry]:
    'The line of a fess taken over and over: the field cut across into equal bars of two tinctures laid alternately. French says fascé, from the fasce.',
  [VariationType.paly]:
    'The same down the field instead of across, along the line of a pale. The first tincture takes the piece at dexter, the viewer’s left.',
  [VariationType.bendy]:
    'The line of a bend repeated, corner to corner. The first tincture takes the piece against the dexter chief corner, which is how the armorials draw it.',
  [VariationType.pily]:
    'Not a line repeated but a rank of long triangles driven into each other point first: piles from the chief, and piles from the base between them. French calls them émanches.',
  [VariationType.chevronny]:
    'The chevron repeated down the field, each piece bent to the same point. Six pieces or eight, says either tongue, and the armorials here write six.',
};

/**
 * How many pieces the field is understood to have, and which tongue says so.
 *
 * The number itself is asked of the vocabulary; what this adds is what the two
 * tongues do about it, which is the one thing they disagree on.
 */
function counting(type: VariationType): string {
  const usual = usualPieces(type);
  return usual === undefined
    ? 'Counted every time. Neither tongue settles a number for this one, so a blazon that leaves it out is refused rather than guessed at — and because its pieces interlock rather than follow one another, it is counted odd as readily as even.'
    : `${capitalise(counted(EnglishNumbers, usual))} pieces understood. French writes the number only when it is some other — “fascé d’argent et de gueules” is six — where English states it either way: “barry of six argent and gules”. The pieces are even, always: an odd count is how heraldry says bars borne on a field instead.`;
}

const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

// The number a varied field is drawn in where it is left to the drawing: the one
// it is understood to have, or eight for the one that is understood to have none.
const DRAWN = 8;

const armsOf = (type: VariationType, pieces: number): Blazon => ({
  field: { type, firstTincture: FIRST, secondTincture: SECOND, pieces },
});

/**
 * The same field cut into some other number of pieces.
 *
 * Two of them, which is enough to show that the number is part of the blazon:
 * one below the number understood and one above, and for the pily an odd count,
 * which it alone may have.
 */
function otherCounts(type: VariationType): ReferenceVariants {
  const counts = usualPieces(type) === undefined ? [5, 10] : [4, 10];
  return {
    heading: 'Cut otherwise',
    entries: counts.map((pieces) => {
      const blazon = armsOf(type, pieces);
      return {
        label: `In ${pieces}`,
        blazon,
        inFrench: inFrench.write(blazon),
        inEnglish: inEnglish.write(blazon),
      };
    }),
  };
}

function entry(type: DivisionType): ReferenceEntry {
  const blazon = { field: { type, firstTincture: FIRST, secondTincture: SECOND } };
  return {
    term: type,
    english: nameOf(EnglishDivisionType, type),
    french: nameOf(FrenchDivisionType, type),
    gloss: GLOSS[type],
    blazon,
    inFrench: inFrench.write(blazon),
    inEnglish: inEnglish.write(blazon),
  };
}

function variedEntry(type: VariationType): ReferenceEntry {
  const blazon = armsOf(type, usualPieces(type) ?? DRAWN);
  return {
    term: type,
    english: nameOf(EnglishVariationType, type),
    french: nameOf(FrenchVariationType, type),
    gloss: VARIED_GLOSS[type],
    note: counting(type),
    blazon,
    inFrench: inFrench.write(blazon),
    inEnglish: inEnglish.write(blazon),
    variants: otherCounts(type),
  };
}

const RANKS: readonly ReferenceRank[] = [
  {
    heading: 'Plain divisions',
    law: 'The field cut in two along one line. Each is shown argent and gules, so the only thing that changes from one to the next is the line itself.',
    entries: Object.values(DivisionType).map(entry),
  },
  {
    heading: 'Varied fields',
    law: 'The same lines taken over and over, cutting the field into a row of equal pieces of two tinctures laid alternately. How many pieces is part of the blazon.',
    entries: Object.values(VariationType).map(variedEntry),
  },
];

export interface DivisionsPageProps {
  readonly colourings?: readonly Colouring[];
}

export function DivisionsPage({ colourings }: DivisionsPageProps) {
  return (
    <Reference
      title="Divisions"
      extent="Four divisions · five varied fields"
      lead={
        <>
          <p className="plane__lead">
            The lines a field may be divided along. The first tincture named always takes the half
            in chief, so the order of the words decides which side is which.
          </p>
          <p className="plane__lead">
            A line may also be taken over and over, cutting the field into a row of equal pieces
            rather than into halves. That is a varied field, and it is named after the band rather
            than after the partition: the line of a <span lang="en">fess</span> divides{' '}
            <span lang="en">per fess</span> and repeats into <span lang="en">barry</span>, which
            French calls <span lang="fr">fascé</span>, after the <span lang="fr">fasce</span>.
          </p>
          <p className="plane__lead">
            How many pieces is part of the blazon, and the two tongues keep it differently. Four of
            the five are understood to be cut in six, which French leaves unwritten —{' '}
            <span lang="fr">fascé d’argent et de gueules</span> — where English states it all the
            same: <span lang="en">barry of six argent and gules</span>. The fifth is understood to
            be cut in no number at all, so both tongues count it every time.
          </p>
          <p className="plane__lead">Choose any term to read it at full size.</p>
        </>
      }
      ranks={RANKS}
      colourings={colourings}
    />
  );
}
