// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Colours, Metals, TINCTURES } from '../../domain/models/Tinctures';
import { nameOf } from '../../domain/translations/Translation';
import { EnglishTinctures } from '../../domain/translations/en/Tinctures';
import { FrenchTinctures } from '../../domain/translations/fr/Tinctures';
import { WikipediaColours } from '../colours/WikipediaColours';
import { TincturesPage } from './TincturesPage';

afterEach(cleanup);

const rank = (heading: string) =>
  within(screen.getByRole('region', { name: heading })).getAllByRole('listitem');

const svgOf = (item: HTMLElement) =>
  decodeURIComponent(within(item).getByRole('img').getAttribute('src') ?? '');

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

  test.each(Object.values(Metals))('names %s in both languages under Metals', (metal) => {
    render(<TincturesPage />);
    const item = rank('Metals').find((candidate) =>
      candidate.textContent?.includes(nameOf(FrenchTinctures, metal))
    );
    expect(item).toBeDefined();
    expect(item!.textContent).toContain(nameOf(EnglishTinctures, metal));
  });

  test.each(Object.values(Colours))('names %s in both languages under Colours', (colour) => {
    render(<TincturesPage />);
    const item = rank('Colours').find((candidate) =>
      candidate.textContent?.includes(nameOf(FrenchTinctures, colour))
    );
    expect(item).toBeDefined();
    expect(item!.textContent).toContain(nameOf(EnglishTinctures, colour));
  });

  test('draws each tincture as a plain shield of its own colour', () => {
    render(<TincturesPage />);
    const painted = screen.getAllByRole('listitem').map(svgOf);
    for (const tincture of TINCTURES) {
      const shield = painted.find((svg) => svg.includes(`fill="${WikipediaColours[tincture]}"`));
      expect(shield, `no shield painted ${tincture}`).toBeDefined();
      // A plain field is one colour, so only the shield path carries a fill.
      expect(shield!.match(/fill="#[0-9a-f]{6}"/g)).toHaveLength(1);
    }
  });
});
