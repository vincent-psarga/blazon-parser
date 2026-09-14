// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { App } from './App';

beforeEach(() => window.history.pushState(null, '', '/'));
afterEach(cleanup);

const nav = () => screen.getByRole('navigation');
const doc = () => within(nav()).getByRole('button', { name: 'Doc' });
const inMenu = (name: string) => within(nav()).queryByRole('link', { name });
const heading = () => screen.getByRole('heading', { level: 1 }).textContent;

async function openDoc() {
  await userEvent.setup().click(doc());
}

describe('the top menu', () => {
  test('offers the blazon page and a Doc menu', () => {
    render(<App />);
    expect(within(nav()).getByRole('link', { name: 'Blazon' })).toBeInTheDocument();
    expect(doc()).toBeInTheDocument();
  });

  test('keeps the documentation pages behind the Doc menu until it is opened', () => {
    render(<App />);
    expect(doc()).toHaveAttribute('aria-expanded', 'false');
    expect(inMenu('Tinctures')).toBeNull();
    expect(inMenu('Divisions')).toBeNull();
  });

  test('reveals both documentation pages when opened', async () => {
    render(<App />);
    await openDoc();
    expect(doc()).toHaveAttribute('aria-expanded', 'true');
    expect(inMenu('Tinctures')).toBeInTheDocument();
    expect(inMenu('Divisions')).toBeInTheDocument();
  });

  describe('choosing from it', () => {
    test.each([
      ['Tinctures', 'Tinctures', '/doc/tinctures'],
      ['Divisions', 'Divisions', '/doc/divisions'],
    ])('goes to %s', async (link, title, path) => {
      render(<App />);
      await openDoc();
      await userEvent.setup().click(inMenu(link)!);
      expect(heading()).toBe(title);
      expect(window.location.pathname).toBe(path);
    });

    test('closes the menu behind it', async () => {
      render(<App />);
      await openDoc();
      await userEvent.setup().click(inMenu('Tinctures')!);
      expect(doc()).toHaveAttribute('aria-expanded', 'false');
      expect(inMenu('Tinctures')).toBeNull();
    });

    test('marks Doc as where the reader is', async () => {
      render(<App />);
      await openDoc();
      await userEvent.setup().click(inMenu('Divisions')!);
      expect(doc()).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('dismissing it', () => {
    test('closes on a second click of Doc', async () => {
      render(<App />);
      await openDoc();
      await openDoc();
      expect(inMenu('Tinctures')).toBeNull();
    });

    test('closes on Escape', async () => {
      render(<App />);
      await openDoc();
      await userEvent.setup().keyboard('{Escape}');
      expect(inMenu('Tinctures')).toBeNull();
    });

    test('closes on a click that lands elsewhere', async () => {
      render(<App />);
      await openDoc();
      await userEvent.setup().click(document.body);
      expect(inMenu('Tinctures')).toBeNull();
    });

    test('stays open while the reader is still inside it', async () => {
      render(<App />);
      await openDoc();
      await userEvent.setup().pointer({ target: inMenu('Tinctures')!, keys: '[MouseLeft>]' });
      expect(inMenu('Divisions')).toBeInTheDocument();
    });
  });
});

describe('the blazon page', () => {
  test('is what the reader lands on', () => {
    render(<App />);
    expect(heading()).toBe('Blazon');
  });

  test('is reachable again from a documentation page', async () => {
    render(<App />);
    await openDoc();
    await userEvent.setup().click(inMenu('Tinctures')!);
    await userEvent.setup().click(within(nav()).getByRole('link', { name: 'Blazon' }));
    expect(heading()).toBe('Blazon');
  });
});

describe('a path no page answers to', () => {
  test('says so rather than showing nothing', () => {
    window.history.pushState(null, '', '/doc/charges');
    render(<App />);
    expect(heading()).toBe('Nothing here');
  });
});
