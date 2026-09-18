// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { WikipediaColours } from '../../src/infra/colours/WikipediaColours';
import { OUTLINE } from '../utils/Colourings';
import { vocabularyIn } from '../utils/Vocabulary';
import { mount } from '../testing/Mounting';
import { VocabularyPage } from './VocabularyPage';

afterEach(cleanup);

const FRENCH = vocabularyIn('fr');
const ENGLISH = vocabularyIn('en');

const ghost = (word: string) => screen.getByRole('link', { name: word });
const showing = () => document.querySelector('.showing') as HTMLElement;
const struck = () => showing().querySelector('.showing__word')?.textContent;
const strike = async (word: string) => userEvent.setup().click(ghost(word));

const painting = (colouring: string) =>
  decodeURIComponent(
    within(showing())
      .getByAltText(new RegExp(`, ${colouring}$`, 'i'))
      .getAttribute('src') ?? ''
  );

describe('the vocabulary of one tongue', () => {
  test('states how many words there are, counting them rather than claiming', () => {
    mount(<VocabularyPage language="fr" />);
    expect(screen.getByText(new RegExp(`^${FRENCH.length} words`))).toBeInTheDocument();
  });

  test.each(FRENCH.map((entry) => entry.word))('keeps %s present in the stack', (word) => {
    mount(<VocabularyPage language="fr" />);
    expect(ghost(word)).toBeInTheDocument();
  });

  test.each(ENGLISH.map((entry) => entry.word))('keeps %s present in English too', (word) => {
    mount(<VocabularyPage language="en" />);
    expect(ghost(word)).toBeInTheDocument();
  });

  test('holds the French words to the French page and the English to the English', () => {
    mount(<VocabularyPage language="fr" />);
    expect(screen.queryByRole('link', { name: 'saltire' })).toBeNull();
    cleanup();
    mount(<VocabularyPage language="en" />);
    expect(screen.queryByRole('link', { name: 'sautoir' })).toBeNull();
  });

  test('files the words under the letters of the alphabet', () => {
    mount(<VocabularyPage language="fr" />);
    const letters = Array.from(document.querySelectorAll('.stack__letter')).map(
      (heading) => heading.textContent
    );
    expect(letters).toEqual([...letters].sort());
    // The accented word is filed where a reader looks for it.
    expect(letters).toContain('E');
    expect(within(screen.getByLabelText('E')).getByRole('link', { name: 'étoile' })).toBeTruthy();
  });

  test('strikes the head of the vocabulary where the address names no word', () => {
    mount(<VocabularyPage language="fr" />);
    expect(struck()).toBe(FRENCH[0].word);
  });

  test('strikes the word the address names', () => {
    mount(<VocabularyPage language="fr" />, '/doc/vocabulary/fr#sautoir');
    expect(struck()).toBe('sautoir');
  });
});

describe('a word read at full size', () => {
  test('says what it means, in the tongue the documentation is written in', async () => {
    mount(<VocabularyPage language="fr" />);
    await strike('croisette');
    expect(within(showing()).getByText(/The little cross/)).toBeInTheDocument();
  });

  test('names the rank it belongs to', async () => {
    mount(<VocabularyPage language="fr" />);
    await strike('croix');
    expect(showing().querySelector('.showing__rank')?.textContent).toBe('ordinary');
  });

  test('shows it painted and hatched, a tincture being a convention either way', async () => {
    mount(<VocabularyPage language="en" />);
    await strike('saltire');
    expect(painting('colour')).toContain(WikipediaColours[Colours.gules]);
    expect(painting('hatching')).toContain('<pattern');
  });

  test('bears it gules on argent, so what changes is the word', async () => {
    mount(<VocabularyPage language="en" />);
    await strike('billet');
    const painted = painting('colour').match(/(?:fill|stroke)="(#[0-9a-f]{6})"/g) ?? [];
    const [field, ...borne] = painted.filter((paint) => !paint.includes(OUTLINE));
    expect(field).toBe(`fill="${WikipediaColours[Metals.argent]}"`);
    expect(borne.every((paint) => paint.endsWith(`"${WikipediaColours[Colours.gules]}"`))).toBe(
      true
    );
  });

  test('offers a blazon carrying that very spelling, in this tongue alone', async () => {
    mount(<VocabularyPage language="fr" />);
    await strike('billette');
    expect(within(showing()).getByText("D'argent à la billette de gueules.")).toBeInTheDocument();
    expect(within(showing()).queryByText('Argent a billet gules.')).toBeNull();
  });

  test('says what a spelling it reads and never writes comes back as', async () => {
    mount(<VocabularyPage language="en" />);
    await strike('bezant');
    expect(within(showing()).getByText('Written back as')).toBeInTheDocument();
    expect(within(showing()).getByText('Gules a besant.')).toBeInTheDocument();
  });

  test('says nothing of the sort where the blazon comes back as it went in', async () => {
    mount(<VocabularyPage language="en" />);
    await strike('besant');
    expect(within(showing()).queryByText('Written back as')).toBeNull();
  });

  test('stands the hyphenated spelling beside the one it says nothing more than', async () => {
    mount(<VocabularyPage language="fr" />);
    await strike('fleur de lys');
    expect(within(showing()).getByText('fleur-de-lys')).toBeInTheDocument();
  });

  test('sends the reader to the other spellings of the same term, all of them', async () => {
    mount(<VocabularyPage language="en" />, '/doc/vocabulary/en');
    await strike('hurt');
    const seen = within(showing()).getByText('See also').parentElement as HTMLElement;
    expect(Array.from(seen.querySelectorAll('a')).map((link) => link.textContent)).toEqual([
      'roundel',
      'besant',
      'bezant',
      'plate',
      'torteau',
      'pellet',
      'pomme',
    ]);
    expect(seen.querySelector('a')).toHaveAttribute('href', '/doc/vocabulary/en#roundel');
  });

  test('sends the reader across to the other tongue, naming the page it is on', async () => {
    mount(<VocabularyPage language="en" />, '/doc/vocabulary/en');
    await strike('hurt');
    const across = within(showing()).getByText('In French').parentElement as HTMLElement;
    const link = across.querySelector('a') as HTMLElement;
    expect(link).toHaveTextContent('tourteau');
    expect(link).toHaveAttribute('href', '/doc/vocabulary/fr#tourteau');
  });

  test('sends the reader nowhere where the other tongue has no such word', async () => {
    mount(<VocabularyPage language="fr" />);
    await strike('plain');
    expect(within(showing()).queryByText('In English')).toBeNull();
  });
});

describe('what one drawing cannot say', () => {
  test('bears a charge in number, and sows it', async () => {
    mount(<VocabularyPage language="en" />);
    await strike('billet');
    const borne = Array.from(showing().querySelectorAll('.showing__variant'));
    expect(borne.map((figure) => figure.querySelector('b')?.textContent)).toEqual([
      'Twice',
      'Thrice',
      'Sown',
    ]);
  });

  test('says why an ordinary is borne but once, rather than bearing it twice', async () => {
    mount(<VocabularyPage language="en" />);
    await strike('bordure');
    expect(showing().querySelectorAll('.showing__variant')).toHaveLength(0);
    expect(within(showing()).getByText(/shield has one edge/)).toBeInTheDocument();
  });
});
