import { Link } from 'react-router';
import { Armorial } from '../../src/domain/models/Armorial';
import { LANGUAGES, codeOf } from '../utils/Languages';
import { tally } from '../utils/Tally';

/**
 * Where one armorial is read. The index and whatever routes the host keeps have
 * to agree on the address, so it is written once, here.
 */
export function armorialPath(armorial: Armorial): string {
  return `/armorial/${armorial.slug}`;
}

export interface ArmorialsPageProps {
  /** The armorials the host carries. It owns them; the page only shows them. */
  readonly armorials: readonly Armorial[];
}

export function ArmorialsPage({ armorials }: ArmorialsPageProps) {
  const entries = armorials.reduce((count, armorial) => count + armorial.entries.length, 0);

  return (
    <main className="plane">
      <h1>Armorials</h1>
      <p className="plane__extent">
        {tally(armorials.length, 'armorial')} · {tally(entries, 'entry', 'entries')}
      </p>
      <p className="plane__lead">
        Rolls of arms copied from their sources, blazon and all, and read by the parser as they
        stand. They are evidence rather than examples: nothing here was written to be parsed, so
        each one says plainly how much of it the parser could read.
      </p>

      <nav className="index" aria-label="Armorials">
        {armorials.map((armorial) => (
          <Link key={armorial.slug} to={armorialPath(armorial)}>
            <span className="index__name">{armorial.name}</span>
            <p className="index__note">
              {tally(armorial.entries.length, 'entry', 'entries')} ·{' '}
              {LANGUAGES[codeOf(armorial.language)].named} · {armorial.licence}
            </p>
          </Link>
        ))}
      </nav>
    </main>
  );
}
