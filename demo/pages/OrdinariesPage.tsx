import { Blazon } from '../../src/domain/models/Blazon';
import { OrdinaryType, bornInNumber } from '../../src/domain/models/Ordinary';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishOrdinaryType } from '../../src/domain/translations/en/Ordinaries';
import { FrenchOrdinaryType } from '../../src/domain/translations/fr/Ordinaries';
import { EnglishBlazonWriter } from '../../src/application/writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from '../../src/application/writer/FrenchBlazonWriter';
import { Colouring } from '../utils/Colourings';
import {
  Reference,
  ReferenceEntry,
  ReferenceRank,
  ReferenceVariants,
} from '../components/Reference';

// Every ordinary is laid on the same field in the same tincture, so that what
// changes from one to the next is the shape of the band and nothing else.
const FIELD = Metals.argent;
const BORNE = Colours.gules;

const inFrench = new FrenchBlazonWriter();
const inEnglish = new EnglishBlazonWriter();

const GLOSS: Record<OrdinaryType, string> = {
  [OrdinaryType.chief]:
    'A band across the top of the shield, taking about a third of it. The chief is also a place on the shield — the upper part — which is why a division puts its first tincture there.',
  [OrdinaryType.pale]:
    'A band straight down the middle. Not the same as per pale, which cuts the field in two: here the field keeps its own tincture and the band is laid over it.',
  [OrdinaryType.fess]:
    'A band straight across the middle. Not the same as per fess, which cuts the field in two: here the field keeps its own tincture and the band is laid over it.',
  [OrdinaryType.barGemel]:
    'Two narrow bars close together, borne and blazoned as one charge — gemel is twinned. French calls it the jumelle. Three bars gemel are three pairs, and so six bars.',
  [OrdinaryType.bend]:
    'A band from dexter chief to sinister base — from the top left, as you look at it. French calls it the bande, along the line tranché divides.',
  [OrdinaryType.bendSinister]:
    'The mirror of a bend, from sinister chief. Sinister means the bearer’s left, never yours. French calls it the barre, along the line taillé divides.',
  [OrdinaryType.chevron]:
    'An inverted V, its point towards the chief and its limbs running down to the base.',
  [OrdinaryType.cross]:
    'The pale and the fess crossing — the cross of Saint George. Its four arms are one charge, not two bands.',
  [OrdinaryType.saltire]:
    'A diagonal cross, corner to corner — the saltire of Saint Andrew. Its two limbs are one charge, not two.',
};

/**
 * Why an ordinary is borne but once, for the three that are.
 *
 * The vocabulary says which they are; this says why, which is a thing to be read
 * rather than derived. Keyed on OrdinaryType, so an ordinary added to the
 * vocabulary breaks the page until it is said whether it has a reason.
 */
const BUT_ONCE: Record<OrdinaryType, string | undefined> = {
  [OrdinaryType.chief]:
    'Borne but once. A chief is not a band laid somewhere on the shield but the top of the shield itself, and a shield has one top.',
  [OrdinaryType.pale]: undefined,
  [OrdinaryType.fess]: undefined,
  [OrdinaryType.barGemel]: undefined,
  [OrdinaryType.bend]: undefined,
  [OrdinaryType.bendSinister]: undefined,
  [OrdinaryType.chevron]: undefined,
  [OrdinaryType.cross]:
    'Borne but once. The four arms are one charge, not two bands: repeated, a cross becomes crosslets, which are small charges strewn on the field rather than an ordinary.',
  [OrdinaryType.saltire]:
    'Borne but once. The two limbs are one charge, and repeating them makes charges of them too, never a second saltire.',
};

const IN_NUMBER =
  'Borne in number. A field may bear two of it, or three, or more: the bands narrow and space themselves evenly to make room for each other, and the count is named before the plural.';

// Two and three, which is enough to show what a count does to the drawing: the
// bands narrow, and the field keeps as much of itself between them as they take.
const COUNTS: readonly (readonly [string, number])[] = [
  ['Twice', 2],
  ['Thrice', 3],
];

const armsOf = (type: OrdinaryType, count?: number): Blazon => ({
  field: { tincture: FIELD },
  ordinary: count === undefined ? { type, tincture: BORNE } : { type, tincture: BORNE, count },
});

/** The same ordinary borne twice and thrice, for the five that may be. */
function inNumber(type: OrdinaryType): ReferenceVariants | undefined {
  if (!bornInNumber(type)) {
    return undefined;
  }
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

function entry(type: OrdinaryType): ReferenceEntry {
  const blazon = armsOf(type);
  return {
    term: type,
    english: nameOf(EnglishOrdinaryType, type),
    french: nameOf(FrenchOrdinaryType, type),
    gloss: GLOSS[type],
    note: BUT_ONCE[type] ?? IN_NUMBER,
    blazon,
    inFrench: inFrench.write(blazon),
    inEnglish: inEnglish.write(blazon),
    variants: inNumber(type),
  };
}

const RANKS: readonly ReferenceRank[] = [
  {
    heading: 'Ordinaries',
    law: 'Each is borne gules on the same argent field, so the only thing that changes from one to the next is the band itself.',
    entries: Object.values(OrdinaryType).map(entry),
  },
];

export interface OrdinariesPageProps {
  readonly colourings?: readonly Colouring[];
}

export function OrdinariesPage({ colourings }: OrdinariesPageProps) {
  return (
    <Reference
      title="Ordinaries"
      extent="Nine ordinaries · six of them borne in number"
      lead={
        <>
          <p className="plane__lead">
            The plain bands a field may be charged with. An ordinary does not divide the field: the
            field keeps its own tincture, and the band is laid over it in a tincture of its own.
          </p>
          <p className="plane__lead">
            Most are named after the same line as a partition, because both follow it. What says a
            field bears one rather than is divided by one is the little word in front: English
            divides <span lang="en">per fess</span> and charges <span lang="en">a fess</span>.
            French changes the word outright — <span lang="fr">coupé</span> divides where{' '}
            <span lang="fr">fasce</span> is borne — and puts an article in front that agrees in
            gender: <span lang="fr">à la fasce</span> but <span lang="fr">au chevron</span>.
          </p>
          <p className="plane__lead">
            A field bears one kind of ordinary, and that ordinary is a plain band of a plain
            tincture. Nothing may yet be charged upon it, and no line but the straight one is read.
          </p>
          <p className="plane__lead">
            It may bear several of that kind, though, and then the bands narrow and space themselves
            to make room for each other: <span lang="fr">De gueules à trois chevrons d’or</span> is{' '}
            <span lang="en">Gules three chevrons or</span>. Six of the nine may be borne in number
            and three may not, and each says below which it is, the six drawn twice and thrice
            beside the one.
          </p>
          <p className="plane__lead">
            The little word in front is blazonry’s rather than French’s: a blazon says{' '}
            <span lang="fr">à trois bandes</span> where ordinary French would contract the article
            into <span lang="fr">aux</span>. Both are read, and each language counts in its own
            words as far as sixteen — the next number is hyphenated, and the parser reads letters. A
            count in figures is read too, and comes back out spelled.
          </p>
          <p className="plane__lead">Choose any term to read it at full size.</p>
        </>
      }
      ranks={RANKS}
      colourings={colourings}
    />
  );
}
