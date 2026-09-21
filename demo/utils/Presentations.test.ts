import { describe, expect, test } from 'vitest';
import {
  PRESENTATIONS,
  Presentation,
  inOrder,
  presentationNamed,
  presentationPath,
} from './Presentations';

const deck = (order: number, slug: string): Presentation => ({
  order,
  slug,
  title: slug,
  slides: 1,
  source: '',
  // Never opened here: these suites are about what the index makes of a
  // deck's name, not about what the deck draws.
  load: () => Promise.reject(new Error('not opened')),
});

describe('the order the decks are shown in', () => {
  test('reads the number as a number, so twelve follows two', () => {
    // Filed as text, 12 would come between 1 and 2, which is the whole reason
    // the prefix is read rather than sorted on.
    const shown = inOrder([deck(2, 'second'), deck(12, 'twelfth'), deck(1, 'first')]);
    expect(shown.map((one) => one.slug)).toEqual(['first', 'second', 'twelfth']);
  });

  test('settles two decks given the same number by their slugs', () => {
    const shown = inOrder([deck(3, 'beta'), deck(3, 'alpha')]);
    expect(shown.map((one) => one.slug)).toEqual(['alpha', 'beta']);
  });

  test('shows a deck whose name carries no number after the numbered ones', () => {
    const unnumbered = { ...deck(Number.MAX_SAFE_INTEGER, 'unnumbered') };
    const shown = inOrder([unnumbered, deck(9, 'ninth')]);
    expect(shown.map((one) => one.slug)).toEqual(['ninth', 'unnumbered']);
  });

  test('leaves the list it was handed where it stands', () => {
    const given = [deck(2, 'second'), deck(1, 'first')];
    inOrder(given);
    expect(given.map((one) => one.slug)).toEqual(['second', 'first']);
  });
});

describe('the decks kept in the directory', () => {
  test('are found without being listed anywhere', () => {
    // Nothing names them but the directory itself: a deck is added by dropping
    // a file in, and this is what says so.
    expect(PRESENTATIONS.length).toBeGreaterThan(0);
  });

  test('answer to their name, less the number that orders them and the extension', () => {
    expect(PRESENTATIONS.map((deck) => deck.slug)).toContain('the-herald-playground');
  });

  test('are called what their first heading calls them, the file name being an address', () => {
    const deck = presentationNamed('the-herald-playground');
    expect(deck?.title).toBe(/^#\s+(.+)$/m.exec(deck?.source ?? '')?.[1]);
    expect(deck?.title).not.toBe(deck?.slug);
  });

  test("keep their markdown whole, the cutting being the deck's own business", () => {
    expect(presentationNamed('the-herald-playground')?.source).toContain('## The project');
  });

  test('count their slides by the rule the deck is cut on', () => {
    const deck = presentationNamed('the-herald-playground');
    // The rules in the file, and the slide they leave behind.
    const rules = (deck?.source.match(/^-{3,}$/gm) ?? []).length;
    expect(deck?.slides).toBe(rules + 1);
    expect(rules).toBeGreaterThan(0);
  });

  test('say nothing when no file answers to the slug', () => {
    expect(presentationNamed('a-deck-nobody-wrote')).toBeUndefined();
  });

  test('are reached at one address, written in one place', () => {
    expect(presentationPath('the-herald-playground')).toBe(
      '/doc/presentations/the-herald-playground'
    );
  });
});
