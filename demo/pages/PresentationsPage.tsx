import { Link } from 'react-router';
import { Presentation, presentationPath } from '../utils/Presentations';
import { tally } from '../utils/Tally';

export interface PresentationsPageProps {
  /** The decks the host carries. It owns them; the page only lists them. */
  readonly presentations: readonly Presentation[];
}

/**
 * Where the decks are listed.
 *
 * They are talks rather than documentation: what was said about the project on
 * some occasion, kept as it was said. So the page promises nothing about them
 * being current, and names each by the heading the deck opens with.
 */
export function PresentationsPage({ presentations }: PresentationsPageProps) {
  const slides = presentations.reduce((count, deck) => count + deck.slides, 0);

  return (
    <main className="plane">
      <h1>Presentations</h1>
      <p className="plane__extent">
        {tally(presentations.length, 'deck')} · {tally(slides, 'slide')}
      </p>
      <p className="plane__lead">
        Decks written to talk the project through, kept in the order they were given. They say what
        was true when they were written, which is not a promise about what is true now: the
        vocabulary and the conventions are where the parser answers for itself.
      </p>

      {presentations.length === 0 ? (
        <p className="plane__lead">No deck has been written yet.</p>
      ) : (
        <nav className="index" aria-label="Presentations">
          {presentations.map((deck) => (
            <Link key={deck.slug} to={presentationPath(deck.slug)}>
              <span className="index__name">{deck.title}</span>
              <p className="index__note">{tally(deck.slides, 'slide')}</p>
            </Link>
          ))}
        </nav>
      )}
    </main>
  );
}
