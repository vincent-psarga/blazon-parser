// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Languages, TONGUES } from '../../src/domain/models/Languages';
import { mount } from '../testing/Mounting';
import { vocabularyIn, vocabularyPath } from '../utils/Vocabulary';
import { RULES } from './ConventionsPage';
import { DocIndexPage } from './DocIndexPage';

afterEach(cleanup);

const index = (name: string) =>
  within(screen.getByRole('navigation', { name })).getAllByRole('link');
const arms = (name: string) => index(name).filter((link) => link.querySelector('img') !== null);

describe('the index of the documentation', () => {
  test('leads to each vocabulary by name', () => {
    mount(<DocIndexPage />, '/doc');
    for (const language of TONGUES) {
      expect(
        within(screen.getByRole('navigation', { name: 'Documentation' })).getByRole('link', {
          name: language === Languages.fr ? 'French vocabulary' : 'English vocabulary',
        })
      ).toHaveAttribute('href', vocabularyPath(language));
    }
  });

  test('shows a handful of each vocabulary rather than the whole of it', () => {
    mount(<DocIndexPage />, '/doc');
    // Ten apiece, where the vocabularies run to forty and more: the index is a
    // way in rather than an inventory.
    expect(arms('Documentation')).toHaveLength(20);
    expect(vocabularyIn(Languages.fr).length).toBeGreaterThan(10);
  });

  test('leads from each arms to the word it was drawn from', () => {
    mount(<DocIndexPage />, '/doc');
    const anchors = [...vocabularyIn(Languages.fr), ...vocabularyIn(Languages.en)].map(
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
    const words = [...vocabularyIn(Languages.fr), ...vocabularyIn(Languages.en)].map(
      (entry) => entry.word
    );
    for (const arm of arms('Documentation')) {
      expect(words).toContain(arm.getAttribute('aria-label'));
    }
  });

  test('shows as many conventions as it shows words of a vocabulary', () => {
    mount(<DocIndexPage />, '/doc');
    // Ten again, where the conventions run to more: an entry that grew past the
    // others stood a longer row than either of them.
    expect(arms('Conventions')).toHaveLength(10);
    expect(RULES.length).toBeGreaterThan(10);
  });

  test('leads from each arms to the rule it was drawn from, and names it', () => {
    mount(<DocIndexPage />, '/doc');
    const shown = arms('Conventions');
    const rules = new Map(RULES.map((rule) => [`/doc/conventions#${rule.id}`, rule.heading]));
    expect(new Set(shown.map((arm) => arm.getAttribute('href'))).size).toBe(shown.length);
    for (const arm of shown) {
      const href = arm.getAttribute('href') ?? '';
      expect(rules.get(href)).toBe(arm.getAttribute('aria-label'));
    }
  });

  test('counts the whole of each vocabulary, though it shows a handful', () => {
    mount(<DocIndexPage />, '/doc');
    expect(
      screen.getByText(
        new RegExp(`${vocabularyIn(Languages.fr).length} words of french vocabulary`, 'i')
      )
    ).toBeInTheDocument();
  });
});
