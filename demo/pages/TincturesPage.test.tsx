// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { mount } from '../testing/Mounting';
import { afterEach, describe, expect, test } from 'vitest';
import { Colours, Furs, Metals, SHADES, TINCTURES } from '../../src/domain/models/Tinctures';
import { Paint, isPattern } from '../../src/domain/services/IBlazonDrawer';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishTinctures } from '../../src/domain/translations/en/Tinctures';
import { FrenchTinctures } from '../../src/domain/translations/fr/Tinctures';
import { HatchingColours } from '../../src/infra/colours/HatchingColours';
import { WikipediaColours } from '../../src/infra/colours/WikipediaColours';
import { TincturesPage } from './TincturesPage';

afterEach(cleanup);

// The set is labelled in the page's own language; the struck term carries both.
const ghost = (tincture: (typeof TINCTURES)[number]) =>
  screen.getByRole('link', { name: nameOf(EnglishTinctures, tincture) });
const showing = () => document.querySelector('.showing') as HTMLElement;
const painting = (colouring: string) =>
  decodeURIComponent(
    within(showing())
      .getByAltText(new RegExp(`, ${colouring}$`, 'i'))
      .getAttribute('src') ?? ''
  );
const names = () => {
  const [english, french] = Array.from(
    showing().querySelectorAll('.showing__names dd')
  ) as HTMLElement[];
  return { english, french };
};

const fillOf = (paint: Paint) => (isPattern(paint) ? paint.fill : paint);

describe('TincturesPage', () => {
  test('keeps the three ranks apart', () => {
    mount(<TincturesPage />);
    for (const heading of ['Metals', 'Colours', 'Furs']) {
      expect(screen.getByRole('region', { name: heading })).toBeInTheDocument();
    }
  });

  test('gives the reader the rule the ranks exist for', () => {
    mount(<TincturesPage />);
    expect(screen.getByText(/Metal may not be laid on metal/)).toBeInTheDocument();
    expect(screen.getByText(/Nor colour on colour/)).toBeInTheDocument();
    expect(screen.getByText(/answer to neither rank/)).toBeInTheDocument();
  });

  test('states how many terms there are before showing any', () => {
    mount(<TincturesPage />);
    expect(screen.getByText(/Eight tinctures/)).toBeInTheDocument();
  });

  test.each(TINCTURES)('keeps %s present in the stack', (tincture) => {
    mount(<TincturesPage />);
    expect(ghost(tincture)).toBeInTheDocument();
  });

  test.each(TINCTURES)('reads %s in both languages when struck', async (tincture) => {
    mount(<TincturesPage />);
    await userEvent.setup().click(ghost(tincture));
    // Four of the eight are spelled alike in both tongues, so the two readings are
    // told apart by where they sit and what they are marked as, never by their text.
    const { english, french } = names();
    expect(english).toHaveTextContent(nameOf(EnglishTinctures, tincture));
    expect(english).toHaveAttribute('lang', 'en');
    expect(french).toHaveTextContent(nameOf(FrenchTinctures, tincture));
    expect(french).toHaveAttribute('lang', 'fr');
  });

  test.each(SHADES)('paints %s in colour and in hatching when struck', async (tincture) => {
    mount(<TincturesPage />);
    await userEvent.setup().click(ghost(tincture));
    expect(painting('colour')).toContain(`fill="${fillOf(WikipediaColours[tincture])}"`);
    expect(painting('hatching')).toContain(`fill="${fillOf(HatchingColours[tincture])}"`);
  });

  // A fur is no shade, so no colouring holds one: it is a figure the drawer cuts
  // from the pair the fur is understood to have, and the drawing carries it.
  test.each(Object.values(Furs))('covers %s with a pelt in either painting', async (fur) => {
    mount(<TincturesPage />);
    await userEvent.setup().click(ghost(fur));
    expect(painting('colour')).toContain('<pattern');
    expect(painting('hatching')).toContain('<pattern');
  });

  describe('the terms a newcomer would stumble on', () => {
    test.each([
      [Colours.vert, /share nothing whatever/],
      [Metals.or, /never the conjunction/],
      [Furs.ermine, /h is mute/],
      [Colours.sable, /spelled alike in both/],
    ])('glosses %s', async (tincture, gloss) => {
      mount(<TincturesPage />);
      await userEvent.setup().click(ghost(tincture));
      expect(within(showing()).getByText(gloss)).toBeInTheDocument();
    });
  });

  test('labels the set in the language the page is written in', () => {
    mount(<TincturesPage />);
    expect(ghost(Colours.gules)).toContainHTML('lang="en"');
    expect(
      screen.queryByRole('button', { name: nameOf(FrenchTinctures, Colours.gules) })
    ).toBeNull();
  });

  test('still marks the French reading as French where it is given', async () => {
    mount(<TincturesPage />);
    await userEvent.setup().click(ghost(Colours.gules));
    expect(names().french).toHaveAttribute('lang', 'fr');
  });
});
