// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { mount } from '../testing/Mounting';
import { afterEach, describe, expect, test } from 'vitest';
import { DivisionType, VariationType, usualPieces } from '../../src/domain/models/Field';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { counted } from '../../src/domain/translations/Numbers';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishNumbers } from '../../src/domain/translations/en/Numbers';
import { EnglishDivisionType } from '../../src/domain/translations/en/Divisions';
import { EnglishVariationType } from '../../src/domain/translations/en/Variations';
import { FrenchDivisionType } from '../../src/domain/translations/fr/Divisions';
import { FrenchVariationType } from '../../src/domain/translations/fr/Variations';
import { FrenchBlazonParser } from '../../src/application/parser/FrenchBlazonParser';
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
  test('states how many divisions there are, and how many varied fields', () => {
    mount(<DivisionsPage />);
    expect(screen.getByText(/Four divisions · five varied fields/)).toBeInTheDocument();
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

const VARIATIONS = Object.values(VariationType);
const variedGhost = (type: VariationType) =>
  screen.getByRole('link', { name: nameOf(EnglishVariationType, type) });
const variants = () => showing().querySelector('.showing__variants');
const borne = () => Array.from(variants()?.querySelectorAll('figure') ?? []);

describe('the varied fields, which stand in a rank of their own', () => {
  test('sets the two kinds apart, each under its own heading', () => {
    mount(<DivisionsPage />);
    expect(screen.getByRole('heading', { name: 'Plain divisions' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Varied fields' })).toBeInTheDocument();
  });

  test('keeps the plain divisions out of the varied rank, and the varied out of theirs', () => {
    mount(<DivisionsPage />);
    const ranks = Array.from(document.querySelectorAll('.stack__rank'));
    const [divisions, varied] = ranks;
    expect(ranks).toHaveLength(2);
    expect(within(divisions as HTMLElement).getByText('per fess')).toBeInTheDocument();
    expect(within(divisions as HTMLElement).queryByText('barry')).toBeNull();
    expect(within(varied as HTMLElement).getByText('barry')).toBeInTheDocument();
    expect(within(varied as HTMLElement).queryByText('per fess')).toBeNull();
  });

  test.each(VARIATIONS)('keeps %s present in the stack', (type) => {
    mount(<DivisionsPage />);
    expect(variedGhost(type)).toBeInTheDocument();
  });

  test.each(VARIATIONS)('reads %s in both languages when struck', async (type) => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(variedGhost(type));
    const { english, french } = names();
    expect(english).toHaveTextContent(nameOf(EnglishVariationType, type));
    expect(french).toHaveTextContent(nameOf(FrenchVariationType, type));
  });

  test.each(VARIATIONS)('offers %s as a blazon the parser reads back', async (type) => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(variedGhost(type));
    const written = showing().querySelector('.showing__usage [lang="fr"]')?.textContent ?? '';
    expect(new FrenchBlazonParser().parse(written).field).toMatchObject({ type });
  });

  test.each(VARIATIONS)('says of %s how many pieces it is understood to have', async (type) => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(variedGhost(type));
    const said = showing().querySelector('.showing__note')?.textContent ?? '';
    const usual = usualPieces(type);
    expect(said).toMatch(
      usual === undefined
        ? /^Counted every time/
        : new RegExp(`^${counted(EnglishNumbers, usual)} pieces understood`, 'i')
    );
  });

  test('draws the pieces the term is understood to have, where it is understood to have any', async () => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(variedGhost(VariationType.barry));
    expect(within(showing()).getByText("Fascé d'argent et de gueules.")).toBeInTheDocument();
    expect(within(showing()).getByText('Barry of six argent and gules.')).toBeInTheDocument();
  });

  test('counts the pily every time, in both tongues', async () => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(variedGhost(VariationType.pily));
    expect(within(showing()).getByText('Pily of eight argent and gules.')).toBeInTheDocument();
    expect(
      within(showing()).getByText("Émanché d'argent et de gueules de huit pièces.")
    ).toBeInTheDocument();
  });

  test.each(VARIATIONS)('shows %s cut into two further numbers of pieces', async (type) => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(variedGhost(type));
    expect(borne()).toHaveLength(2);
  });

  test('offers the pily cut in an odd number, which it alone may be', async () => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(variedGhost(VariationType.pily));
    expect(borne()[0].textContent).toContain('In 5');
  });

  test('shows no further arms for a plain division: it is cut in two and that is all', async () => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(ghost(DivisionType.pale));
    expect(variants()).toBeNull();
  });
});
