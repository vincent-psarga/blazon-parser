// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { DivisionType } from '../../domain/models/Field';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { nameOf } from '../../domain/translations/Translation';
import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { WikipediaColours } from '../colours/WikipediaColours';
import { DivisionsPage } from './DivisionsPage';

afterEach(cleanup);

const ARGENT = WikipediaColours[Metals.argent];
const GULES = WikipediaColours[Colours.gules];

const svgOf = (item: HTMLElement) =>
  decodeURIComponent(within(item).getByRole('img').getAttribute('src') ?? '');

const itemFor = (division: DivisionType) =>
  screen
    .getAllByRole('listitem')
    .find((candidate) => candidate.textContent?.includes(nameOf(FrenchDivisionType, division)));

describe('DivisionsPage', () => {
  test('lists every division exactly once', () => {
    render(<DivisionsPage />);
    expect(screen.getAllByRole('listitem')).toHaveLength(Object.values(DivisionType).length);
  });

  test.each(Object.values(DivisionType))('names %s in both languages', (division) => {
    render(<DivisionsPage />);
    expect(itemFor(division)!.textContent).toContain(nameOf(EnglishDivisionType, division));
  });

  test.each(Object.values(DivisionType))('draws %s argent and gules', (division) => {
    render(<DivisionsPage />);
    const svg = svgOf(itemFor(division)!);
    expect(svg.match(/fill="(#[0-9a-f]{6})"/g)).toEqual([`fill="${ARGENT}"`, `fill="${GULES}"`]);
  });

  test('draws a different shield for every division', () => {
    render(<DivisionsPage />);
    const shields = screen.getAllByRole('listitem').map(svgOf);
    expect(new Set(shields).size).toBe(shields.length);
  });

  test('shows how each division is blazoned in either language', () => {
    render(<DivisionsPage />);
    const perPale = itemFor(DivisionType.pale)!;
    expect(perPale.textContent).toContain("Parti d'argent et de gueules.");
    expect(perPale.textContent).toContain('Per pale argent and gules.');
  });
});
