// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { App } from './App';
import { PRESENTATIONS } from './utils/Presentations';

beforeEach(() => window.history.pushState(null, '', '/'));
afterEach(cleanup);

const rail = () =>
  screen.getByRole('navigation', { name: '' }) ?? screen.getAllByRole('navigation')[0];
const doc = () => within(screen.getAllByRole('navigation')[0]).getByRole('button', { name: 'Doc' });
const inMenu = (name: string) =>
  within(screen.getAllByRole('navigation')[0]).queryByRole('link', { name });
const heading = () => screen.getByRole('heading', { level: 1 }).textContent;
// A term of the vocabulary is a place in the page, and is reached as places are.
const term = (name: string) => screen.getByRole('link', { name });

const openDoc = () => userEvent.setup().click(doc());

describe('the rail', () => {
  test('carries the demo, the documentation and the armorials, and names each once', () => {
    render(<App />);
    expect(within(rail()).getByRole('link', { name: 'Demo' })).toBeInTheDocument();
    expect(within(rail()).getByRole('link', { name: 'Armorials' })).toBeInTheDocument();
    expect(doc()).toBeInTheDocument();
    // Two entries pointing at the same page is one entry too many.
    expect(within(rail()).getAllByRole('link')).toHaveLength(2);
  });

  test('keeps the documentation behind the menu until it is opened', () => {
    render(<App />);
    expect(doc()).toHaveAttribute('aria-expanded', 'false');
    expect(inMenu('Conventions')).toBeNull();
  });

  test('offers the index alongside every page when opened', async () => {
    render(<App />);
    await openDoc();
    for (const name of [
      'Everything',
      'French vocabulary',
      'English vocabulary',
      'Conventions',
      'Presentations',
    ]) {
      expect(inMenu(name)).toBeInTheDocument();
    }
  });

  test.each([
    ['Everything', 'The vocabulary', '/doc'],
    ['French vocabulary', 'The French vocabulary', '/doc/vocabulary/fr'],
    ['English vocabulary', 'The English vocabulary', '/doc/vocabulary/en'],
    ['Conventions', 'Conventions', '/doc/conventions'],
    ['Presentations', 'Presentations', '/doc/presentations'],
  ])('goes to %s', async (link, title, path) => {
    render(<App />);
    await openDoc();
    await userEvent.setup().click(inMenu(link)!);
    expect(heading()).toBe(title);
    expect(window.location.pathname).toBe(path);
  });

  test('marks Doc as where the reader is, on any documentation page', async () => {
    render(<App />);
    await openDoc();
    await userEvent.setup().click(inMenu('English vocabulary')!);
    expect(doc()).toHaveAttribute('aria-current', 'page');
  });

  describe('dismissing the menu', () => {
    test.each([
      ['a second click of Doc', async () => openDoc()],
      ['Escape', async () => userEvent.setup().keyboard('{Escape}')],
      ['a click landing elsewhere', async () => userEvent.setup().click(document.body)],
    ])('closes on %s', async (_name, dismiss) => {
      render(<App />);
      await openDoc();
      await dismiss();
      expect(inMenu('Conventions')).toBeNull();
    });
  });
});

describe('the index', () => {
  test('says what a blazon may be, and promises nothing more', async () => {
    window.history.pushState(null, '', '/doc');
    render(<App />);
    expect(screen.getByText(/nothing here promises either/)).toBeInTheDocument();
  });

  test.each([
    ['French vocabulary', 'The French vocabulary'],
    ['English vocabulary', 'The English vocabulary'],
  ])('leads to the %s', async (link, title) => {
    window.history.pushState(null, '', '/doc');
    render(<App />);
    const index = screen.getByRole('navigation', { name: 'Documentation' });
    await userEvent.setup().click(within(index).getByRole('link', { name: new RegExp(link) }));
    expect(heading()).toBe(title);
  });

  test('leads from the index to the conventions, which are not vocabulary', async () => {
    window.history.pushState(null, '', '/doc');
    render(<App />);
    const index = screen.getByRole('navigation', { name: 'Conventions' });
    await userEvent.setup().click(within(index).getByRole('link', { name: /Conventions/ }));
    expect(heading()).toBe('Conventions');
    expect(window.location.pathname).toBe('/doc/conventions');
  });
});

describe('the anchor a word of the vocabulary answers to', () => {
  test('leaves the struck word in the address', async () => {
    window.history.pushState(null, '', '/doc/vocabulary/en');
    render(<App />);
    await userEvent.setup().click(term('saltire'));
    expect(window.location.pathname).toBe('/doc/vocabulary/en');
    expect(window.location.hash).toBe('#saltire');
  });

  test('spells a word of two words the way an address spells things', async () => {
    window.history.pushState(null, '', '/doc/vocabulary/en');
    render(<App />);
    await userEvent.setup().click(term('bend sinister'));
    expect(window.location.hash).toBe('#bend-sinister');
  });

  test('reads the word named in the address on arrival', () => {
    window.history.pushState(null, '', '/doc/vocabulary/en#saltire');
    render(<App />);
    expect(term('saltire')).toHaveAttribute('aria-current', 'true');
  });

  test('walks back through the words that were read', async () => {
    window.history.pushState(null, '', '/doc/vocabulary/en');
    render(<App />);
    const user = userEvent.setup();
    await user.click(term('gules'));
    await user.click(term('vert'));
    window.history.back();
    await waitFor(() => expect(term('gules')).toHaveAttribute('aria-current', 'true'));
  });
});

describe('handing a term to the translator', () => {
  test('carries the struck blazon over in French, and leaves it in the address', async () => {
    window.history.pushState(null, '', '/doc/vocabulary/fr');
    render(<App />);
    const user = userEvent.setup();
    await user.click(term('sinople'));
    await user.click(screen.getByRole('link', { name: 'De sinople.' }));

    expect(heading()).toBe('Blazon');
    expect(screen.getByLabelText('Blazon')).toHaveValue('De sinople.');
    expect(window.location.search).toContain('De%20sinople.');
  });

  test('carries it over in English when the English page is the one read', async () => {
    window.history.pushState(null, '', '/doc/vocabulary/en');
    render(<App />);
    const user = userEvent.setup();
    await user.click(term('vert'));
    await user.click(screen.getByRole('link', { name: 'Vert.' }));

    expect(screen.getByLabelText('Blazon')).toHaveValue('Vert.');
    expect(screen.getByLabelText('Language')).toHaveValue('en');
  });

  test('carries an ordinary over as a blazon the reader can then read back', async () => {
    window.history.pushState(null, '', '/doc/vocabulary/fr');
    render(<App />);
    const user = userEvent.setup();
    await user.click(term('sautoir'));
    await user.click(screen.getByRole('link', { name: "D'argent au sautoir de gueules." }));

    expect(heading()).toBe('Blazon');
    expect(screen.getByLabelText('Blazon')).toHaveValue("D'argent au sautoir de gueules.");
  });

  test('carries one of the counted arms over rather than the single one', async () => {
    window.history.pushState(null, '', '/doc/vocabulary/fr#chevron');
    render(<App />);
    await userEvent
      .setup()
      .click(screen.getByRole('link', { name: "D'argent à deux chevrons de gueules." }));
    expect(screen.getByLabelText('Blazon')).toHaveValue("D'argent à deux chevrons de gueules.");
  });

  test('reads a blazon named in the address on arrival', () => {
    window.history.pushState(null, '', `/?b=${encodeURIComponent('De gueules')}`);
    render(<App />);
    expect(screen.getByLabelText('Blazon')).toHaveValue('De gueules');
  });

  test('reads it in the tongue the address says it is written in', () => {
    window.history.pushState(null, '', `/?b=${encodeURIComponent('Gules')}&lang=en`);
    render(<App />);
    expect(screen.getByLabelText('Blazon')).toHaveValue('Gules');
    expect(screen.getByLabelText('Language')).toHaveValue('en');
  });
});

describe('the armorials', () => {
  const armorials = () => within(rail()).getByRole('link', { name: 'Armorials' });

  test('are reached from the rail', async () => {
    render(<App />);
    await userEvent.setup().click(armorials());
    expect(heading()).toBe('Armorials');
    expect(window.location.pathname).toBe('/armorials');
  });

  test('lead from the index to the armorial itself', async () => {
    window.history.pushState(null, '', '/armorials');
    render(<App />);
    const index = screen.getByRole('navigation', { name: 'Armorials' });
    await userEvent.setup().click(within(index).getByRole('link', { name: /A sample armorial/ }));
    expect(heading()).toBe('A sample armorial');
    expect(window.location.pathname).toBe('/armorial/sample');
  });

  test('read the armorial named in the address on arrival', () => {
    window.history.pushState(null, '', '/armorial/sample');
    render(<App />);
    expect(heading()).toBe('A sample armorial');
    expect(screen.getByText(/was able to parse/)).toBeInTheDocument();
  });

  test('mark the rail entry as where the reader is, index and armorial alike', async () => {
    window.history.pushState(null, '', '/armorial/sample');
    render(<App />);
    expect(armorials()).toHaveAttribute('aria-current', 'page');
  });

  test('say so rather than showing nothing when no armorial answers to the slug', () => {
    window.history.pushState(null, '', '/armorial/nowhere');
    render(<App />);
    expect(heading()).toBe('Nothing here');
  });
});

describe('the presentations', () => {
  // Taken from the directory rather than written out: the decks are content, and
  // a test that spells one out goes red when somebody rewrites a slide.
  const deck = PRESENTATIONS[0]!;

  test('list the decks kept beside the demo', () => {
    window.history.pushState(null, '', '/doc/presentations');
    render(<App />);
    expect(heading()).toBe('Presentations');
    const index = screen.getByRole('navigation', { name: 'Presentations' });
    expect(within(index).getByRole('link', { name: new RegExp(deck.title) })).toHaveAttribute(
      'href',
      `/doc/presentations/${deck.slug}`
    );
  });

  test('show the deck named in the address as slides', async () => {
    window.history.pushState(null, '', `/doc/presentations/${deck.slug}`);
    render(<App />);
    // The presenter and the deck are both fetched when a deck is opened, so the
    // deck's own first heading is waited for: it is drawn on the slide it opens
    // with, and again as the page's title.
    // Waited for the second of them: the first is the page's own title, which
    // is there before the deck is.
    await waitFor(() => expect(screen.getAllByText(deck.title)).toHaveLength(2));
    // Twice over as a heading, too: the page says which deck is open whatever
    // slide the reader has reached, and the deck opens on its own name.
    expect(screen.getAllByRole('heading', { level: 1 }).map((one) => one.textContent)).toContain(
      deck.title
    );
  });

  test('say so rather than showing nothing when no file answers to the slug', () => {
    window.history.pushState(null, '', '/doc/presentations/a-deck-nobody-wrote');
    render(<App />);
    expect(heading()).toBe('Nothing here');
  });
});

describe('a path no page answers to', () => {
  test('says so rather than showing nothing', () => {
    window.history.pushState(null, '', '/doc/crowns');
    render(<App />);
    expect(heading()).toBe('Nothing here');
  });
});

describe('served from a subdirectory, as on GitHub Pages', () => {
  beforeEach(() => {
    vi.stubEnv('BASE_URL', '/blazon-parser/');
    window.history.pushState(null, '', '/blazon-parser/');
  });
  afterEach(() => vi.unstubAllEnvs());

  test('shows the demo at the base itself rather than claiming nothing answers', () => {
    render(<App />);
    expect(heading()).toBe('Blazon');
  });

  test('reads a page below the base', () => {
    window.history.pushState(null, '', '/blazon-parser/doc/vocabulary/en');
    render(<App />);
    expect(heading()).toBe('The English vocabulary');
  });

  test('keeps the base in the address when navigating', async () => {
    render(<App />);
    await openDoc();
    await userEvent.setup().click(inMenu('English vocabulary')!);
    expect(heading()).toBe('The English vocabulary');
    expect(window.location.pathname).toBe('/blazon-parser/doc/vocabulary/en');
  });

  test('reads an armorial below the base', () => {
    window.history.pushState(null, '', '/blazon-parser/armorial/sample');
    render(<App />);
    expect(heading()).toBe('A sample armorial');
  });

  test('points the links themselves below the base, for whoever opens one in a new tab', async () => {
    render(<App />);
    expect(within(rail()).getByRole('link', { name: 'Demo' })).toHaveAttribute(
      'href',
      '/blazon-parser/'
    );
    expect(within(rail()).getByRole('link', { name: 'Armorials' })).toHaveAttribute(
      'href',
      '/blazon-parser/armorials'
    );
    await openDoc();
    expect(inMenu('French vocabulary')).toHaveAttribute('href', '/blazon-parser/doc/vocabulary/fr');
  });
});
