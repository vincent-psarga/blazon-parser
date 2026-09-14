import { OrdinaryType } from '../../src/domain/models/Ordinary';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishOrdinaryType } from '../../src/domain/translations/en/Ordinaries';
import { FrenchOrdinaryType } from '../../src/domain/translations/fr/Ordinaries';
import { EnglishBlazonWriter } from '../../src/application/writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from '../../src/application/writer/FrenchBlazonWriter';
import { Colouring } from '../utils/Colourings';
import { Reference, ReferenceEntry, ReferenceRank } from '../components/Reference';

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

function entry(type: OrdinaryType): ReferenceEntry {
  const blazon = { field: { tincture: FIELD }, ordinary: { type, tincture: BORNE } };
  return {
    term: type,
    french: nameOf(FrenchOrdinaryType, type),
    english: nameOf(EnglishOrdinaryType, type),
    reference: type,
    gloss: GLOSS[type],
    blazon,
    inFrench: inFrench.write(blazon),
    inEnglish: inEnglish.write(blazon),
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
  readonly onTry?: (blazon: string) => void;
}

export function OrdinariesPage({ colourings, onTry }: OrdinariesPageProps) {
  return (
    <Reference
      title="Ordinaries"
      extent="Eight ordinaries · all the parser reads"
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
            A field bears one ordinary at most, and that ordinary is a plain band of a plain
            tincture. Nothing may yet be charged upon it, and no line but the straight one is read.
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
