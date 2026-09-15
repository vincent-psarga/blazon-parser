// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { mount } from '../testing/Mounting';
import { afterEach, describe, expect, test } from 'vitest';
import { DivisionType } from '../../src/domain/models/Field';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishDivisionType } from '../../src/domain/translations/en/Divisions';
import { FrenchDivisionType } from '../../src/domain/translations/fr/Divisions';
import { WikipediaColours } from '../../src/infra/colours/WikipediaColours';
import { DivisionsPage } from './DivisionsPage';

afterEach(cleanup);

const DIVISIONS = Object.values(DivisionType);
const ghost = (type: DivisionType) =>
  screen.getByRole('link', { name: nameOf(EnglishDivisionType, type) });
const showing = () => document.querySelector('.showing') as HTMLElement;
const names = () => {
  const [english, french] = Array.from(
    showing().querySelectorAll('.showing__names dd')
  ) as HTMLElement[];
  return { english, french };
};

const painting = (colouring: string) =>
  decodeURIComponent(
    within(showing())
      .getByAltText(new RegExp(`, ${colouring}$`, 'i'))
      .getAttribute('src') ?? ''
  );

describe('DivisionsPage', () => {
  test('states how many divisions there are', () => {
    mount(<DivisionsPage />);
    expect(screen.getByText(/Four divisions/)).toBeInTheDocument();
  });

  test.each(DIVISIONS)('keeps %s present in the stack', (type) => {
    mount(<DivisionsPage />);
    expect(ghost(type)).toBeInTheDocument();
  });

  test.each(DIVISIONS)('reads %s in both languages when struck', async (type) => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(ghost(type));
    const { english, french } = names();
    expect(english).toHaveTextContent(nameOf(EnglishDivisionType, type));
    expect(english).toHaveAttribute('lang', 'en');
    expect(french).toHaveTextContent(nameOf(FrenchDivisionType, type));
    expect(french).toHaveAttribute('lang', 'fr');
  });

  test.each(DIVISIONS)('cuts %s from the same two tinctures as every other', async (type) => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(ghost(type));
    expect(painting('colour').match(/fill="(#[0-9a-f]{6})"/g)).toEqual([
      `fill="${WikipediaColours[Metals.argent]}"`,
      `fill="${WikipediaColours[Colours.gules]}"`,
    ]);
  });

  test('shows the struck partition inside a blazon a reader could type', async () => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(ghost(DivisionType.pale));
    expect(within(showing()).getByText("Parti d'argent et de gueules.")).toBeInTheDocument();
    expect(within(showing()).getByText('Per pale argent and gules.')).toBeInTheDocument();
  });

  test('warns that sinister is the bearer’s left, not the reader’s', async () => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(ghost(DivisionType.bendSinister));
    expect(within(showing()).getByText(/never yours/)).toBeInTheDocument();
  });
});
