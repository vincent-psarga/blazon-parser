import { useMemo } from 'react';
import { BlazonShield } from '../BlazonShield';
import { LANGUAGES, LanguageCode, otherThan } from '../../utils/Languages';
import { readBlazon } from '../../utils/Reading';

/**
 * A deck names its tongue the way a talk does, in full: a slide is written for
 * a reader rather than for a router, and `language="french"` is what somebody
 * writing one reaches for. The two-letter code is accepted just as readily.
 */
const SPOKEN: Record<string, LanguageCode> = {
  french: 'fr',
  français: 'fr',
  fr: 'fr',
  english: 'en',
  en: 'en',
};

export interface BlazonProps {
  /** The blazon itself, written as it would be written anywhere else. */
  readonly blazon: string;
  /** The tongue it is written in. French unless the slide says otherwise. */
  readonly language?: string;
  /** How wide the arms are drawn, against Spectacle's own 1366 by 768 canvas. */
  readonly width?: number;
}

/**
 * The library's whole trick on one slide: a blazon read, drawn, and said back in
 * the other tongue.
 *
 * It is the parser that answers here and not a fixture — the arms are drawn from
 * what the parser made of the words, and the translation is what the writer said
 * of that. A blazon the parser refuses says so on the slide, which is worth
 * showing too: a talk that only ever shows what works is not showing the parser.
 */
export function Blazon({ blazon, language = 'french', width = 260 }: BlazonProps) {
  const spoken = SPOKEN[language.toLowerCase()] ?? 'fr';
  const other = otherThan(spoken);
  const read = useMemo(() => readBlazon(blazon, spoken), [blazon, spoken]);

  return (
    <figure className="slide-blazon">
      {'blazon' in read ? (
        <BlazonShield blazon={read.blazon} alt={blazon} width={width} />
      ) : (
        <p className="slide-blazon__refused">Refused: {read.refused}</p>
      )}
      <figcaption>
        <p lang={spoken}>{blazon}</p>
        {'blazon' in read && (
          <p className="slide-blazon__abroad" lang={other}>
            {LANGUAGES[other].writer.write(read.blazon)}
          </p>
        )}
      </figcaption>
    </figure>
  );
}
