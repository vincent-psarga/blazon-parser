// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { DivisionType } from '../../domain/models/Field';
import { Colours, Metals } from '../../domain/models/Tinctures';
import { nameOf } from '../../domain/translations/Translation';
import { EnglishDivisionType } from '../../domain/translations/en/Divisions';
import { FrenchDivisionType } from '../../domain/translations/fr/Divisions';
import { WikipediaColours } from '../colours/WikipediaColours';
import { DivisionsPage } from './DivisionsPage';

afterEach(cleanup);

const DIVISIONS = Object.values(DivisionType);
const ghost = (type: DivisionType) =>
  screen.getByRole('button', { name: nameOf(EnglishDivisionType, type) });
const showing = () => document.querySelector('.showing') as HTMLElement;
const names = () => {
  const [french, english] = Array.from(
    showing().querySelectorAll('.showing__names dd')
  ) as HTMLElement[];
  return { french, english };
};

const painting = (colouring: string) =>
  decodeURIComponent(
    within(showing())
      .getByAltText(new RegExp(`, ${colouring}$`, 'i'))
      .getAttribute('src') ?? ''
  );

describe('DivisionsPage', () => {
  test('states how many partitions there are', () => {
    render(<DivisionsPage />);
    expect(screen.getByText(/Four partitions/)).toBeInTheDocument();
  });

  test.each(DIVISIONS)('keeps %s present in the stack', (type) => {
    render(<DivisionsPage />);
    expect(ghost(type)).toBeInTheDocument();
  });

  test.each(DIVISIONS)('reads %s in both languages when struck', async (type) => {
    render(<DivisionsPage />);
    await userEvent.setup().click(ghost(type));
    const { french, english } = names();
    expect(french).toHaveTextContent(nameOf(FrenchDivisionType, type));
    expect(french).toHaveAttribute('lang', 'fr');
    expect(english).toHaveTextContent(nameOf(EnglishDivisionType, type));
    expect(english).toHaveAttribute('lang', 'en');
    expect(within(showing()).getByText(type)).toBeInTheDocument();
  });

  test.each(DIVISIONS)('cuts %s from the same two tinctures as every other', async (type) => {
    render(<DivisionsPage />);
    await userEvent.setup().click(ghost(type));
    expect(painting('colour').match(/fill="(#[0-9a-f]{6})"/g)).toEqual([
      `fill="${WikipediaColours[Metals.argent]}"`,
      `fill="${WikipediaColours[Colours.gules]}"`,
    ]);
  });

  test('shows the struck partition inside a blazon a reader could type', async () => {
    render(<DivisionsPage />);
    await userEvent.setup().click(ghost(DivisionType.pale));
    expect(within(showing()).getByText("Parti d'argent et de gueules.")).toBeInTheDocument();
    expect(within(showing()).getByText('Per pale argent and gules.')).toBeInTheDocument();
  });

  test('warns that sinister is the bearer’s left, not the reader’s', async () => {
    render(<DivisionsPage />);
    await userEvent.setup().click(ghost(DivisionType.bendSinister));
    expect(within(showing()).getByText(/never yours/)).toBeInTheDocument();
  });
});
