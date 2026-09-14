import { useMemo, useState } from 'react';
import { Blazon } from '../../domain/models/Blazon';
import { ColorModel } from '../../domain/services/IBlazonDrawer';
import { BlazonShield } from './BlazonShield';
import { LANGUAGES, LanguageCode, otherThan } from './Languages';

export interface BlazonPageProps {
  /** The language the blazon is written in to begin with. */
  readonly initialLanguage?: LanguageCode;
  /** What each tincture is painted with. Heraldry fixes no shade. */
  readonly colours?: ColorModel;
}

type Reading = { readonly blazon: Blazon } | { readonly error: string };

function read(text: string, language: LanguageCode): Reading | undefined {
  if (text.trim() === '') {
    return undefined;
  }
  try {
    return { blazon: LANGUAGES[language].parser.parse(text) };
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : String(cause) };
  }
}

export function BlazonPage({ initialLanguage = 'fr', colours }: BlazonPageProps) {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [text, setText] = useState(LANGUAGES[initialLanguage].example);

  const reading = useMemo(() => read(text, language), [text, language]);
  const blazon = reading !== undefined && 'blazon' in reading ? reading.blazon : undefined;

  const other = otherThan(language);
  const translation = blazon === undefined ? '' : LANGUAGES[other].writer.write(blazon);

  // Switching language would otherwise leave the text unreadable in the language
  // now selected, so a blazon that was understood is carried over translated.
  function switchTo(next: LanguageCode) {
    if (next !== language && blazon !== undefined) {
      setText(LANGUAGES[next].writer.write(blazon));
    }
    setLanguage(next);
  }

  return (
    <main className="blazon-page">
      <h1>Blazon</h1>

      <label htmlFor="blazon-language">Language</label>
      <select
        id="blazon-language"
        value={language}
        onChange={(event) => switchTo(event.target.value as LanguageCode)}
      >
        {Object.entries(LANGUAGES).map(([code, { label }]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>

      <label htmlFor="blazon-text">Blazon</label>
      <textarea
        id="blazon-text"
        rows={3}
        value={text}
        spellCheck={false}
        placeholder={LANGUAGES[language].example}
        onChange={(event) => setText(event.target.value)}
      />

      <section aria-labelledby="blazon-translation-heading">
        <h2 id="blazon-translation-heading">{LANGUAGES[other].label}</h2>
        {reading !== undefined && 'error' in reading ? (
          <p role="alert">{reading.error}</p>
        ) : (
          <p>{translation}</p>
        )}
      </section>

      <section aria-labelledby="blazon-arms-heading">
        <h2 id="blazon-arms-heading">Arms</h2>
        {blazon !== undefined && (
          <BlazonShield blazon={blazon} alt={translation} colours={colours} />
        )}
      </section>
    </main>
  );
}
