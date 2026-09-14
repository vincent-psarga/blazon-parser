// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { App } from './App';

beforeEach(() => window.history.pushState(null, '', '/'));
afterEach(cleanup);

const rail = () =>
  screen.getByRole('navigation', { name: '' }) ?? screen.getAllByRole('navigation')[0];
const doc = () => within(screen.getAllByRole('navigation')[0]).getByRole('button', { name: 'Doc' });
const inMenu = (name: string) =>
  within(screen.getAllByRole('navigation')[0]).queryByRole('link', { name });
const heading = () => screen.getByRole('heading', { level: 1 }).textContent;

const openDoc = () => userEvent.setup().click(doc());

describe('the rail', () => {
  test('carries the demo and the documentation, and names each once', () => {
    render(<App />);
    expect(within(rail()).getByRole('link', { name: 'Demo' })).toBeInTheDocument();
    expect(doc()).toBeInTheDocument();
    // Two entries pointing at the same page is one entry too many.
    expect(within(rail()).getAllByRole('link')).toHaveLength(1);
  });

  test('keeps the documentation behind the menu until it is opened', () => {
    render(<App />);
    expect(doc()).toHaveAttribute('aria-expanded', 'false');
    expect(inMenu('Tinctures')).toBeNull();
  });

  test('offers the index alongside both pages when opened', async () => {
    render(<App />);
    await openDoc();
    for (const name of ['Everything', 'Tinctures', 'Divisions']) {
      expect(inMenu(name)).toBeInTheDocument();
    }
  });

  test.each([
    ['Everything', 'The vocabulary', '/doc'],
    ['Tinctures', 'Tinctures', '/doc/tinctures'],
    ['Divisions', 'Divisions', '/doc/divisions'],
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
    await userEvent.setup().click(inMenu('Divisions')!);
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
      expect(inMenu('Tinctures')).toBeNull();
    });
  });
});

describe('the index', () => {
  test('says what a blazon may be, and promises nothing more', async () => {
    window.history.pushState(null, '', '/doc');
    render(<App />);
    expect(screen.getByText(/no charges or ordinaries yet/)).toBeInTheDocument();
  });

  test('leads to both references', async () => {
    window.history.pushState(null, '', '/doc');
    render(<App />);
    const index = screen.getByRole('navigation', { name: 'Documentation' });
    await userEvent.setup().click(within(index).getByRole('link', { name: /Tinctures/ }));
    expect(heading()).toBe('Tinctures');
  });
});

describe('handing a term to the translator', () => {
  test('carries the struck blazon over, and leaves it in the address', async () => {
    window.history.pushState(null, '', '/doc/tinctures');
    render(<App />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'vert' }));
    await user.click(screen.getByRole('button', { name: 'Read this one' }));

    expect(heading()).toBe('Blazon');
    expect(screen.getByLabelText('Blazon')).toHaveValue('De sinople.');
    expect(window.location.search).toContain('De%20sinople.');
  });

  test('reads a blazon named in the address on arrival', () => {
    window.history.pushState(null, '', `/?b=${encodeURIComponent('De gueules')}`);
    render(<App />);
    expect(screen.getByLabelText('Blazon')).toHaveValue('De gueules');
  });
});

describe('a path no page answers to', () => {
  test('says so rather than showing nothing', () => {
    window.history.pushState(null, '', '/doc/charges');
    render(<App />);
    expect(heading()).toBe('Nothing here');
  });
});
