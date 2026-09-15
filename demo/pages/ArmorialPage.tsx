import { useMemo } from 'react';
import { UnknownWords, readArmorial } from '../../src/application/armorial/ArmorialReading';
import { Armorial } from '../../src/domain/models/Armorial';
import { ColorModel } from '../../src/domain/services/IBlazonDrawer';
import { BlazonShield } from '../components/BlazonShield';
import { COLOURINGS, OUTLINE } from '../utils/Colourings';
import { LANGUAGES, codeOf } from '../utils/Languages';
import { tally } from '../utils/Tally';

/** Small enough to read a row by, large enough to tell two shields apart. */
const ARMS = 72;

export interface ArmorialPageProps {
  readonly armorial: Armorial;
  /** What each tincture is painted with. Heraldry fixes no shade. */
  readonly colours?: ColorModel;
}

/**
 * One armorial, read.
 *
 * The source's own drawing sits beside the parser's, row by row, so the reader
 * judges the reading rather than taking the score's word for it. A blazon the
 * parser could not read keeps its row and leaves the last cell empty: what the
 * vocabulary is missing is the most useful thing an armorial has to say.
 */
export function ArmorialPage({ armorial, colours = COLOURINGS[0]?.colours }: ArmorialPageProps) {
  const language = codeOf(armorial.language);
  const { entries, read, total, score, unknown } = useMemo(
    () => readArmorial(armorial, LANGUAGES[language].parser),
    [armorial, language]
  );

  return (
    <main className="plane">
      <h1>{armorial.name}</h1>
      <p className="plane__extent">
        {tally(total, 'entry', 'entries')} · {LANGUAGES[language].label}{' '}
        {armorial.licence ? `· ${armorial.licence}` : ''}
      </p>

      {armorial.source !== undefined && (
        <p className="plane__lead">
          Copied from <a href={armorial.source.url}>{armorial.source.name}</a>.
        </p>
      )}

      <p className="roll__score">
        blazon-parser was able to parse <b>{score}%</b> of this armorial: {read} of{' '}
        {tally(total, 'blazon')}.
      </p>

      <Unknown words={unknown} language={language} />

      {/* A roll wider than a narrow screen scrolls on its own rather than
          dragging the whole page sideways, and is reachable by keyboard to do
          it. */}
      <div
        className="roll__hold"
        role="region"
        aria-label={`${armorial.name}, entry by entry`}
        tabIndex={0}
      >
        <table className="roll">
          <caption>Every entry as the source records it, and as the parser reads it.</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Source</th>
              <th scope="col">Blazon</th>
              <th scope="col">As the source draws it</th>
              <th scope="col">As the parser draws it</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(({ entry, blazon }, index) => (
              <tr key={`${index}-${entry.name}`}>
                <th scope="row">{entry.name}</th>
                <td>
                  {entry.source !== undefined && <a href={entry.source.url}>{entry.source.name}</a>}
                </td>
                <td className="roll__blazon" lang={language}>
                  {entry.blazon}
                </td>
                <td>
                  {entry.image !== '' && (
                    <img
                      className="roll__arms"
                      src={entry.image}
                      alt=""
                      width={ARMS}
                      loading="lazy"
                    />
                  )}
                </td>
                <td>
                  {blazon !== undefined && (
                    <BlazonShield
                      blazon={blazon}
                      alt={`${entry.name}, as the parser read it`}
                      colours={colours}
                      outline={OUTLINE}
                      width={ARMS}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

/**
 * What the armorial asks for and the vocabulary has not got.
 *
 * Each word is filed under the term the parser was looking for when it stopped,
 * which is not always what the word itself is: a lion standing where an ordinary
 * was due is counted among the ordinaries, because an ordinary is what was owed
 * there. And only one reading is refused per blazon, so this is what the armorial
 * is blocked on first rather than everything it would go on to ask for.
 */
function Unknown({ words, language }: { readonly words: UnknownWords; readonly language: string }) {
  const kinds = [
    { one: 'tincture', many: 'tinctures', words: words.tinctures },
    { one: 'division', many: 'divisions', words: words.divisions },
    { one: 'ordinary', many: 'ordinaries', words: words.ordinaries },
  ].filter((kind) => kind.words.length !== 0);

  if (kinds.length === 0) {
    return null;
  }

  return (
    <div className="gaps">
      <p className="gaps__law">
        Where it stopped, under the term it was expecting there — so a charge standing where an
        ordinary was due is counted an ordinary. One reading is refused per blazon, so these are
        what the armorial is blocked on first, not everything it would go on to ask for.
      </p>
      <dl className="gaps__kinds">
        {kinds.map(({ one, many, words: unknown }) => (
          <div key={one} className="gaps__kind">
            <dt>Unknown {unknown.length === 1 ? one : many}</dt>
            <dd lang={language}>{unknown.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
