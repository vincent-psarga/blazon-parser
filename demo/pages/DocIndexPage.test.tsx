// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { vocabularyIn, vocabularyPath } from '../utils/Vocabulary';
import { mount } from '../testing/Mounting';
import { DocIndexPage } from './DocIndexPage';
import { RULES } from './ConventionsPage';

afterEach(cleanup);

const index = (name: string) =>
  within(screen.getByRole('navigation', { name })).getAllByRole('link');
const arms = (name: string) => index(name).filter((link) => link.querySelector('img') !== null);

describe('the index of the documentation', () => {
  test('leads to each vocabulary by name', () => {
    mount(<DocIndexPage />, '/doc');
    for (const language of ['fr', 'en'] as const) {
      expect(
        within(screen.getByRole('navigation', { name: 'Documentation' })).getByRole('link', {
          name: language === 'fr' ? 'French vocabulary' : 'English vocabulary',
        })
      ).toHaveAttribute('href', vocabularyPath(language));
    }
  });

  test('shows a handful of each vocabulary rather than the whole of it', () => {
    mount(<DocIndexPage />, '/doc');
    // Ten apiece, where the vocabularies run to forty and more: the index is a
    // way in rather than an inventory.
    expect(arms('Documentation')).toHaveLength(20);
    expect(vocabularyIn('fr').length).toBeGreaterThan(10);
  });

  test('leads from each arms to the word it was drawn from', () => {
    mount(<DocIndexPage />, '/doc');
    const anchors = [...vocabularyIn('fr'), ...vocabularyIn('en')].map(
      (entry) => `#${entry.anchor}`
    );
    for (const arm of arms('Documentation')) {
      const href = arm.getAttribute('href') ?? '';
      expect(href).toMatch(/^\/doc\/vocabulary\/(fr|en)#/);
      expect(anchors).toContain(`#${href.split('#')[1]}`);
    }
  });

  test('names the word each arms stands for, a shield saying nothing by itself', () => {
    mount(<DocIndexPage />, '/doc');
    const words = [...vocabularyIn('fr'), ...vocabularyIn('en')].map((entry) => entry.word);
    for (const arm of arms('Documentation')) {
      expect(words).toContain(arm.getAttribute('aria-label'));
    }
  });

  test('shows one arms for every convention, and leads to the rule itself', () => {
    mount(<DocIndexPage />, '/doc');
    const shown = arms('Conventions');
    expect(shown).toHaveLength(RULES.length);
    expect(shown.map((arm) => arm.getAttribute('href'))).toEqual(
      RULES.map((rule) => `/doc/conventions#${rule.id}`)
    );
    expect(shown.map((arm) => arm.getAttribute('aria-label'))).toEqual(
      RULES.map((rule) => rule.heading)
    );
  });

  test('counts the whole of each vocabulary, though it shows a handful', () => {
    mount(<DocIndexPage />, '/doc');
    expect(
      screen.getByText(new RegExp(`${vocabularyIn('fr').length} words of french vocabulary`, 'i'))
    ).toBeInTheDocument();
  });
});
