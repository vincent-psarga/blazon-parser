import { Colours, Furs, Metals, Tincture } from '../../src/domain/models/Tinctures';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishTinctures } from '../../src/domain/translations/en/Tinctures';
import { FrenchTinctures } from '../../src/domain/translations/fr/Tinctures';
import { EnglishBlazonWriter } from '../../src/application/writer/EnglishBlazonWriter';
import { FrenchBlazonWriter } from '../../src/application/writer/FrenchBlazonWriter';
import { Colouring } from '../utils/Colourings';
import { Reference, ReferenceEntry, ReferenceRank } from '../components/Reference';

const inFrench = new FrenchBlazonWriter();
const inEnglish = new EnglishBlazonWriter();

/** A line of help only where the term is genuinely opaque to a newcomer. */
const GLOSS: Record<Tincture, string> = {
  [Metals.or]: 'Gold. The same word in both tongues, and never the conjunction.',
  [Metals.argent]:
    'Silver, or plain white. It carries no hatching at all: the bare paper is the metal.',
  [Colours.azure]: 'Blue. French drops the final e.',
  [Colours.gules]: 'Red. From the fur-trimmed throat of a garment, not from any word for red.',
  [Colours.sable]:
    'Black, spelled alike in both, so only the blazon around it tells you which language you are reading.',
  [Colours.vert]: 'Green, and the one tincture whose two names share nothing whatever.',
  [Furs.ermine]: 'A white pelt strewn with black tails. Its h is mute, so French says d’hermine.',
  [Furs.vair]: 'Squirrel fur, argent and azure, cut into bells and set in alternating rows.',
};

function entry(tincture: Tincture): ReferenceEntry {
  const blazon = { field: { tincture } };
  return {
    term: tincture,
    english: nameOf(EnglishTinctures, tincture),
    french: nameOf(FrenchTinctures, tincture),
    gloss: GLOSS[tincture],
    blazon,
    inFrench: inFrench.write(blazon),
    inEnglish: inEnglish.write(blazon),
  };
}

/**
 * The ranks are kept apart because heraldry keeps them apart, and the page says
 * so rather than leaving the reader to infer it from three unexplained headings.
 */
const RANKS: readonly ReferenceRank[] = [
  {
    heading: 'Metals',
    law: 'Metal may not be laid on metal — half the rule of tincture, and the reason these ranks are kept apart at all.',
    entries: Object.values(Metals).map(entry),
  },
  {
    heading: 'Colours',
    law: 'Nor colour on colour. The rule holds both ways.',
    entries: Object.values(Colours).map(entry),
  },
  {
    heading: 'Furs',
    law: 'The furs answer to neither rank, being reckoned to hold something of both.',
    entries: Object.values(Furs).map(entry),
  },
];

export interface TincturesPageProps {
  /** The paintings to show each tincture in. */
  readonly colourings?: readonly Colouring[];
}

export function TincturesPage({ colourings }: TincturesPageProps) {
  return (
    <Reference
      title="Tinctures"
      extent="Eight tinctures"
      lead={
        <>
          <p className="plane__lead">
            The tinctures a field may be painted with. Heraldry fixes no hue, only which tincture is
            meant, so these shades are a convention — and the hatching beside each one is how that
            convention survived being engraved in black and white.
          </p>
          <p className="plane__lead">Choose any term to read it at full size.</p>
        </>
      }
      ranks={RANKS}
      colourings={colourings}
    />
  );
}
