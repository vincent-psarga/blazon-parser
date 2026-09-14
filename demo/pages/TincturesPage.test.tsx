// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { Colours, Furs, Metals, TINCTURES } from '../../src/domain/models/Tinctures';
import { isPattern } from '../../src/domain/services/IBlazonDrawer';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishTinctures } from '../../src/domain/translations/en/Tinctures';
import { FrenchTinctures } from '../../src/domain/translations/fr/Tinctures';
import { HatchingColours } from '../../src/infra/colours/HatchingColours';
import { WikipediaColours } from '../../src/infra/colours/WikipediaColours';
import { TincturesPage } from './TincturesPage';

afterEach(cleanup);

// The set is labelled in the page's own language; the struck term carries both.
const ghost = (tincture: (typeof TINCTURES)[number]) =>
  screen.getByRole('button', { name: nameOf(EnglishTinctures, tincture) });
const showing = () => document.querySelector('.showing') as HTMLElement;
const painting = (colouring: string) =>
  decodeURIComponent(
    within(showing())
      .getByAltText(new RegExp(`, ${colouring}$`, 'i'))
      .getAttribute('src') ?? ''
  );
const names = () => {
  const [french, english] = Array.from(
    showing().querySelectorAll('.showing__names dd')
  ) as HTMLElement[];
  return { french, english };
};

const fillOf = (paint: (typeof WikipediaColours)[keyof typeof WikipediaColours]) =>
  isPattern(paint) ? paint.fill : paint;

describe('TincturesPage', () => {
  test('keeps the three ranks apart', () => {
    render(<TincturesPage />);
    for (const heading of ['Metals', 'Colours', 'Furs']) {
      expect(screen.getByRole('region', { name: heading })).toBeInTheDocument();
    }
  });

  test('gives the reader the rule the ranks exist for', () => {
    render(<TincturesPage />);
    expect(screen.getByText(/Metal may not be laid on metal/)).toBeInTheDocument();
    expect(screen.getByText(/Nor colour on colour/)).toBeInTheDocument();
    expect(screen.getByText(/answer to neither rank/)).toBeInTheDocument();
  });

  test('states how many terms there are before showing any', () => {
    render(<TincturesPage />);
    expect(screen.getByText(/Eight tinctures · three ranks/)).toBeInTheDocument();
  });

  test.each(TINCTURES)('keeps %s present in the stack', (tincture) => {
    render(<TincturesPage />);
    expect(ghost(tincture)).toBeInTheDocument();
  });

  test.each(TINCTURES)('reads %s in both languages when struck', async (tincture) => {
    render(<TincturesPage />);
    await userEvent.setup().click(ghost(tincture));
    // Four of the eight are spelled alike in both tongues, so the two readings are
    // told apart by where they sit and what they are marked as, never by their text.
    const { french, english } = names();
    expect(french).toHaveTextContent(nameOf(FrenchTinctures, tincture));
    expect(french).toHaveAttribute('lang', 'fr');
    expect(english).toHaveTextContent(nameOf(EnglishTinctures, tincture));
    expect(english).toHaveAttribute('lang', 'en');
    expect(within(showing()).getByText(tincture)).toBeInTheDocument();
  });

  test.each(TINCTURES)('paints %s in colour and in hatching when struck', async (tincture) => {
    render(<TincturesPage />);
    await userEvent.setup().click(ghost(tincture));
    expect(painting('colour')).toContain(`fill="${fillOf(WikipediaColours[tincture])}"`);
    expect(painting('hatching')).toContain(`fill="${fillOf(HatchingColours[tincture])}"`);
  });

  describe('the terms a newcomer would stumble on', () => {
    test.each([
      [Colours.vert, /share nothing whatever/],
      [Metals.or, /never the conjunction/],
      [Furs.ermine, /h is mute/],
      [Colours.sable, /spelled alike in both/],
    ])('glosses %s', async (tincture, gloss) => {
      render(<TincturesPage />);
      await userEvent.setup().click(ghost(tincture));
      expect(within(showing()).getByText(gloss)).toBeInTheDocument();
    });
  });

  test('labels the set in the language the page is written in', () => {
    render(<TincturesPage />);
    expect(ghost(Colours.gules)).toContainHTML('lang="en"');
    expect(
      screen.queryByRole('button', { name: nameOf(FrenchTinctures, Colours.gules) })
    ).toBeNull();
  });

  test('still marks the French reading as French where it is given', async () => {
    render(<TincturesPage />);
    await userEvent.setup().click(ghost(Colours.gules));
    expect(names().french).toHaveAttribute('lang', 'fr');
  });
});
