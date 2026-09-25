// @vitest-environment jsdom
import { cleanup, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { Languages } from '../../src/domain/models/Languages';
import { mount } from '../testing/Mounting';
import { GLIMPSE, shortened } from '../utils/Shortened';
import { VocabularyEntry, vocabularyIn } from '../utils/Vocabulary';
import { PreviewedLink } from './WordPreview';

afterEach(cleanup);

const ENGLISH = vocabularyIn(Languages.en);

const word = (name: string): VocabularyEntry => {
  const found = ENGLISH.find((entry) => entry.word === name);
  if (found === undefined) {
    throw new Error(`The English vocabulary holds no "${name}"`);
  }
  return found;
};

const shown = (of: VocabularyEntry | undefined) =>
  mount(
    <PreviewedLink word={of} language={Languages.en} to="/doc/vocabulary/en#lozenge">
      lozenge
    </PreviewedLink>
  );

const link = () => screen.getByRole('link', { name: 'lozenge' });
const card = () => screen.queryByRole('tooltip');
/* One session throughout a test: where the pointer has been is the session's to
   remember, and unhovering from a fresh one unhovers nothing. */
const reader = () => userEvent.setup();

describe('PreviewedLink', () => {
  test('shows nothing until the word is asked about', () => {
    shown(word('lozenge'));
    expect(card()).toBeNull();
  });

  test('names the word, draws it, and gives the opening of what it means', async () => {
    shown(word('lozenge'));
    await reader().hover(link());
    const preview = card() as HTMLElement;
    expect(preview.querySelector('.preview__name')).toHaveTextContent('lozenge');
    // The name, the arms and the gloss, and nothing else: the rank is a thing
    // the reading says, not a glimpse.
    expect(preview.querySelector('.preview__rank')).toBeNull();
    expect(preview.querySelector('img')).toBeInTheDocument();
    expect(preview.querySelector('.preview__gloss')?.textContent).toBe(
      shortened(word('lozenge').description)
    );
  });

  test('breaks a gloss too long to glimpse, and says it was broken', async () => {
    // A word whose gloss outruns the room a card has for it.
    const long = ENGLISH.find((entry) => entry.description.length > GLIMPSE) as VocabularyEntry;
    mount(
      <PreviewedLink word={long} language={Languages.en} to="/doc/vocabulary/en">
        lozenge
      </PreviewedLink>
    );
    await reader().hover(link());
    const gloss = (card() as HTMLElement).querySelector('.preview__gloss')?.textContent ?? '';
    expect(gloss.length).toBeLessThanOrEqual(GLIMPSE);
    expect(gloss).toMatch(/…$/u);
    expect(long.description.startsWith(gloss.slice(0, -1))).toBe(true);
  });

  test('shows the blazon nowhere: the card is a glimpse, and the link is the way to the reading', async () => {
    shown(word('lozenge'));
    await reader().hover(link());
    const preview = card() as HTMLElement;
    expect(preview).not.toHaveTextContent(word('lozenge').typed);
    expect(preview.querySelectorAll('a')).toHaveLength(0);
  });

  test('takes the card down again when the word is left', async () => {
    shown(word('lozenge'));
    const reading = reader();
    await reading.hover(link());
    expect(card()).toBeInTheDocument();
    await reading.unhover(link());
    expect(card()).toBeNull();
  });

  test('raises it for the keyboard as well, a word tabbed to being a word asked about', async () => {
    shown(word('lozenge'));
    const reading = reader();
    await reading.tab();
    expect(link()).toHaveFocus();
    expect(card()).toBeInTheDocument();
    await reading.tab();
    expect(card()).toBeNull();
  });

  test('says which word describes the link, so it is read out with it', async () => {
    shown(word('lozenge'));
    await reader().hover(link());
    expect(link()).toHaveAttribute('aria-describedby', (card() as HTMLElement).id);
  });

  test('takes the card down on Escape, as anything laid over a page is', async () => {
    shown(word('lozenge'));
    const reading = reader();
    await reading.hover(link());
    await reading.keyboard('{Escape}');
    expect(card()).toBeNull();
  });

  test('leaves a plain link where the page holds no word to show', async () => {
    // The vocabulary can be sifted down to one kind, and what a word points at
    // is not always of that kind.
    shown(undefined);
    await reader().hover(link());
    expect(card()).toBeNull();
    expect(link()).toHaveAttribute('href', '/doc/vocabulary/en#lozenge');
  });

  test('stays down for a touch, where there is no hovering and a tap is the journey', async () => {
    // A tap focuses the link on its way to following it, which must not be read
    // as the keyboard asking about the word.
    shown(word('lozenge'));
    await reader().pointer({ target: link(), keys: '[TouchA]' });
    expect(link()).toHaveFocus();
    expect(card()).toBeNull();
  });
});
