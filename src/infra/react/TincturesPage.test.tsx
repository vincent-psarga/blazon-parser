// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Colours, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { isPattern } from '../../domain/services/IBlazonDrawer';
import { nameOf } from '../../domain/translations/Translation';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { HatchingColours } from '../colours/HatchingColours';
import { WikipediaColours } from '../colours/WikipediaColours';
import { TincturesPage } from './TincturesPage';

afterEach(cleanup);

const rank = (heading: string) =>
  within(screen.getByRole('region', { name: heading })).getAllByRole('listitem');

const itemFor = (tincture: (typeof TINCTURES)[number]) =>
  screen
    .getAllByRole('listitem')
    .find((candidate) => candidate.textContent?.includes(nameOf(FrenchTinctures, tincture)))!;

const fillOf = (paint: (typeof WikipediaColours)[keyof typeof WikipediaColours]) =>
  isPattern(paint) ? paint.fill : paint;

const shield = (item: HTMLElement, colouring: string) =>
  decodeURIComponent(
    within(item)
      .getByAltText(new RegExp(`, ${colouring}$`, 'i'))
      .getAttribute('src') ?? ''
  );

describe('TincturesPage', () => {
  test('separates the metals from the colours', () => {
    render(<TincturesPage />);
    expect(rank('Metals')).toHaveLength(Object.values(Metals).length);
    expect(rank('Colours')).toHaveLength(Object.values(Colours).length);
  });

  test('lists every tincture exactly once', () => {
    render(<TincturesPage />);
    expect(screen.getAllByRole('listitem')).toHaveLength(TINCTURES.length);
  });

  test.each(TINCTURES)('names %s in both languages', (tincture) => {
    render(<TincturesPage />);
    expect(itemFor(tincture).textContent).toContain(nameOf(FrenchTinctures, tincture));
    expect(itemFor(tincture).textContent).toContain(nameOf(EnglishTinctures, tincture));
  });

  describe('showing both ways of painting a tincture', () => {
    test.each(TINCTURES)('gives %s a shield in each', (tincture) => {
      render(<TincturesPage />);
      const item = itemFor(tincture);
      expect(within(item).getAllByRole('img')).toHaveLength(2);
      expect(within(item).getByText('Colour')).toBeInTheDocument();
      expect(within(item).getByText('Hatching')).toBeInTheDocument();
    });

    test.each(TINCTURES)('paints %s with its own colour', (tincture) => {
      render(<TincturesPage />);
      const svg = shield(itemFor(tincture), 'colour');
      expect(svg).toContain(`fill="${fillOf(WikipediaColours[tincture])}"`);
    });

    test.each(TINCTURES.filter((tincture) => !isPattern(WikipediaColours[tincture])))(
      'needs no pattern to paint %s',
      (tincture) => {
        render(<TincturesPage />);
        expect(shield(itemFor(tincture), 'colour')).not.toContain('<pattern');
      }
    );

    test.each(TINCTURES.filter((tincture) => tincture !== Metals.argent))(
      'hatches %s with its own marks',
      (tincture) => {
        render(<TincturesPage />);
        const paint = HatchingColours[tincture];
        const svg = shield(itemFor(tincture), 'hatching');
        expect(isPattern(paint)).toBe(true);
        expect(svg).toContain(fillOf(paint));
        expect(svg).toContain('<pattern');
      }
    );

    test('leaves argent blank when hatched, as the convention does', () => {
      render(<TincturesPage />);
      const svg = shield(itemFor(Metals.argent), 'hatching');
      expect(svg).toContain('fill="#ffffff"');
      expect(svg).not.toContain('<pattern');
    });

    test('tells the two shields apart for anyone who cannot see them', () => {
      render(<TincturesPage />);
      const item = itemFor(Colours.azure);
      expect(within(item).getByAltText('azure, colour')).toBeInTheDocument();
      expect(within(item).getByAltText('azure, hatching')).toBeInTheDocument();
    });
  });

  test('shows whatever paintings it is given instead', () => {
    render(<TincturesPage colourings={[{ label: 'Hatching', colours: HatchingColours }]} />);
    const item = itemFor(Colours.gules);
    expect(within(item).getAllByRole('img')).toHaveLength(1);
    expect(within(item).queryByText('Colour')).toBeNull();
  });
});
