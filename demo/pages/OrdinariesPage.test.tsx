// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { OrdinaryType } from '../../src/domain/models/Ordinary';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishOrdinaryType } from '../../src/domain/translations/en/Ordinaries';
import { FrenchOrdinaryType } from '../../src/domain/translations/fr/Ordinaries';
import { FrenchBlazonParser } from '../../src/application/parser/FrenchBlazonParser';
import { WikipediaColours } from '../../src/infra/colours/WikipediaColours';
import { OrdinariesPage } from './OrdinariesPage';

afterEach(cleanup);

const ORDINARIES = Object.values(OrdinaryType);
const ghost = (type: OrdinaryType) =>
  screen.getByRole('button', { name: nameOf(EnglishOrdinaryType, type) });
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

describe('OrdinariesPage', () => {
  test('states how many ordinaries there are', () => {
    render(<OrdinariesPage />);
    expect(screen.getByText(/Eight ordinaries/)).toBeInTheDocument();
  });

  test.each(ORDINARIES)('keeps %s present in the stack', (type) => {
    render(<OrdinariesPage />);
    expect(ghost(type)).toBeInTheDocument();
  });

  test.each(ORDINARIES)('reads %s in both languages when struck', async (type) => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    const { french, english } = names();
    expect(french).toHaveTextContent(nameOf(FrenchOrdinaryType, type));
    expect(french).toHaveAttribute('lang', 'fr');
    expect(english).toHaveTextContent(nameOf(EnglishOrdinaryType, type));
    expect(english).toHaveAttribute('lang', 'en');
    expect(within(showing()).getByText(type)).toBeInTheDocument();
  });

  test.each(ORDINARIES)('bears %s on the same field as every other', async (type) => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    // The field first, then the band over it — and a saltire draws two limbs of
    // the one charge, so the band's colour may repeat.
    const [field, ...borne] = painting('colour').match(/fill="(#[0-9a-f]{6})"/g) ?? [];
    expect(field).toBe(`fill="${WikipediaColours[Metals.argent]}"`);
    expect(borne.length).toBeGreaterThan(0);
    expect(borne.every((fill) => fill === `fill="${WikipediaColours[Colours.gules]}"`)).toBe(true);
  });

  test('shows the struck ordinary inside a blazon a reader could type', async () => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.fess));
    expect(within(showing()).getByText("D'argent à la fasce de gueules.")).toBeInTheDocument();
    expect(within(showing()).getByText('Argent a fess gules.')).toBeInTheDocument();
  });

  test.each(ORDINARIES)('offers %s as a blazon the parser reads back', async (type) => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    const written = showing().querySelector('.showing__usage [lang="fr"]')?.textContent ?? '';
    expect(new FrenchBlazonParser().parse(written).ordinary).toMatchObject({ type });
  });

  test('separates bearing a fess from being divided per fess', async () => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.fess));
    expect(within(showing()).getByText(/not the same as per fess/i)).toBeInTheDocument();
  });

  test('says which article French puts in front of each', () => {
    render(<OrdinariesPage />);
    expect(screen.getByText('à la fasce')).toBeInTheDocument();
    expect(screen.getByText('au chevron')).toBeInTheDocument();
  });

  test('warns that a bend sinister runs from the bearer’s left, not the reader’s', async () => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.bendSinister));
    expect(within(showing()).getByText(/never yours/)).toBeInTheDocument();
  });

  test('separates bearing a pale from being divided per pale', async () => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.pale));
    expect(within(showing()).getByText(/not the same as per pale/i)).toBeInTheDocument();
  });
});
