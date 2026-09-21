// @vitest-environment jsdom
import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { mount } from '../testing/Mounting';
import { Presentation } from '../utils/Presentations';
import Deck from '../testing/Deck.mdx';
import { PresentationPage } from './PresentationPage';

afterEach(cleanup);

// A deck of the kind the directory holds, compiled the way the build compiles
// them: the fixture is MDX, so what is under test is what a reader is shown.
const DECK: Presentation = {
  order: 0,
  slug: 'a-deck',
  title: 'A deck',
  slides: 4,
  source: '',
  load: () => Promise.resolve({ default: Deck }),
};

/** The two the build paired off, in the order they are to be read across. */
const pairedIn = (slide: Element | undefined) =>
  [...(slide?.children ?? [])]
    .filter((child) => child.className === 'deck__side' || child.className === 'deck__rest')
    .map((child) => child.className);

const slideSaying = (words: string) =>
  [...document.querySelectorAll('.deck__slide')].find((slide) =>
    slide.textContent?.includes(words)
  );

const opened = async () => {
  mount(<PresentationPage presentation={DECK} />, '/doc/presentations/a-deck');
  // The deck is fetched rather than bundled with the page, so it is waited for.
  await screen.findByText('The second slide');
};

describe('a deck, shown as slides', () => {
  test('says which deck is open, whatever slide the reader has reached', async () => {
    await opened();
    expect(document.querySelector('.deck__head h1')).toHaveTextContent('A deck');
  });

  test('leads back to the whole list, a deck being a page a reader arrives at', async () => {
    await opened();
    expect(screen.getByRole('link', { name: 'All presentations' })).toHaveAttribute(
      'href',
      '/doc/presentations'
    );
  });

  test('cuts the file where the markdown says to cut it', async () => {
    await opened();
    // Both slides are drawn: the deck holds them all and shows one at a time,
    // rather than fetching each as it is reached. The name is on the page twice
    // over — once as the page's own title, once as the slide the deck opens on.
    expect(screen.getAllByText('A deck')).toHaveLength(2);
    expect(screen.getByText('One thing')).toBeInTheDocument();
  });

  test('leaves no rule of the markdown drawn, a rule being where a slide ends', async () => {
    await opened();
    expect(document.querySelector('hr')).toBeNull();
  });

  test('lets a slide call a component by name, and draws what it asked for', async () => {
    await opened();
    // The arms are drawn from what the parser made of the words on the slide.
    expect(screen.getByRole('img', { name: "d'or au sautoir de gueules" })).toBeInTheDocument();
  });

  test('sets what a slide put aside beside the rest of it, markdown and all', async () => {
    await opened();
    const side = document.querySelector('.deck__side');
    const rest = side?.parentElement?.querySelector('.deck__rest');
    expect(side?.textContent).toContain('Beside what was written first');
    expect(rest?.textContent).toContain('a list, which begins two spaces in');
  });

  test('puts a side written after what it stands beside on the right of it', async () => {
    await opened();
    // The two are read across in the order they are written down, so which side
    // a side is on is which of the two the build put first.
    expect(pairedIn(slideSaying('written after what it stands beside'))).toEqual([
      'deck__rest',
      'deck__side',
    ]);
  });

  test('puts a side written before what it stands beside on the left of it', async () => {
    await opened();
    expect(pairedIn(slideSaying('written before it'))).toEqual(['deck__side', 'deck__rest']);
  });

  test('spans a slide with its title, whichever side the side is on', async () => {
    await opened();
    const slide = slideSaying('written before it');
    // The title is neither of the two that were paired off: it stands above
    // them, and a rule of the stylesheet gives it the width of both.
    expect(slide?.firstElementChild?.textContent).toBe('A side written before it');
    expect(slide?.firstElementChild?.className).not.toContain('deck__');
  });

  test('leaves a slide that set nothing aside in one piece', async () => {
    await opened();
    const slide = slideSaying('One thing');
    expect(slide?.querySelector('.deck__side')).toBeNull();
    expect(slide?.querySelector('.deck__rest')).toBeNull();
  });

  test('lays every slide out the same way, whether it sets anything aside or not', async () => {
    await opened();
    expect(document.querySelectorAll('.deck__slide')).toHaveLength(DECK.slides);
  });
});
