// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { mount } from '../testing/Mounting';
import { afterEach, describe, expect, test } from 'vitest';
import { DivisionType, FurType, VariationType, usualPieces } from '../../src/domain/models/Field';
import { Colours, Metals } from '../../src/domain/models/Tinctures';
import { counted } from '../../src/domain/translations/Numbers';
import { nameOf } from '../../src/domain/translations/Translation';
import { EnglishNumbers } from '../../src/domain/translations/en/Numbers';
import { EnglishDivisionType } from '../../src/domain/translations/en/Divisions';
import { EnglishFurType } from '../../src/domain/translations/en/Furs';
import { EnglishVariationType } from '../../src/domain/translations/en/Variations';
import { FrenchDivisionType } from '../../src/domain/translations/fr/Divisions';
import { FrenchFurType } from '../../src/domain/translations/fr/Furs';
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
  test('states how many divisions there are, how many varied fields and how many furred', () => {
    mount(<DivisionsPage />);
    expect(
      screen.getByText(/Four divisions · five varied fields · one furred field/)
    ).toBeInTheDocument();
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
  test('sets the three kinds apart, each under its own heading', () => {
    mount(<DivisionsPage />);
    expect(screen.getByRole('heading', { name: 'Plain divisions' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Varied fields' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Furred fields' })).toBeInTheDocument();
  });

  test('keeps each kind to its own rank, and none of the three in another', () => {
    mount(<DivisionsPage />);
    const ranks = Array.from(document.querySelectorAll('.stack__rank'));
    const [divisions, varied, furred] = ranks;
    expect(ranks).toHaveLength(3);
    expect(within(divisions as HTMLElement).getByText('per fess')).toBeInTheDocument();
    expect(within(divisions as HTMLElement).queryByText('barry')).toBeNull();
    expect(within(varied as HTMLElement).getByText('barry')).toBeInTheDocument();
    expect(within(varied as HTMLElement).queryByText('per fess')).toBeNull();
    expect(within(furred as HTMLElement).getByText('vairy')).toBeInTheDocument();
    expect(within(furred as HTMLElement).queryByText('barry')).toBeNull();
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

const FURS = Object.values(FurType);
const furredGhost = (type: FurType) =>
  screen.getByRole('link', { name: nameOf(EnglishFurType, type) });

describe('the furred fields, which stand in a rank of their own', () => {
  test.each(FURS)('keeps %s present in the stack', (type) => {
    mount(<DivisionsPage />);
    expect(furredGhost(type)).toBeInTheDocument();
  });

  test.each(FURS)('reads %s in both languages when struck', async (type) => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(furredGhost(type));
    const { english, french } = names();
    expect(english).toHaveTextContent(nameOf(EnglishFurType, type));
    expect(french).toHaveTextContent(nameOf(FrenchFurType, type));
  });

  test.each(FURS)('offers %s as a blazon the parser reads back', async (type) => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(furredGhost(type));
    const written = showing().querySelector('.showing__usage [lang="fr"]')?.textContent ?? '';
    expect(new FrenchBlazonParser().parse(written).field).toMatchObject({ type });
  });

  test('cuts the vairé from the same two tinctures as every other term on the page', async () => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(furredGhost(FurType.vairy));
    expect(within(showing()).getByText("Vairé d'argent et de gueules.")).toBeInTheDocument();
    expect(within(showing()).getByText('Vairy argent and gules.')).toBeInTheDocument();
  });

  test('tells the reader why a vairé is named where a vair is not', async () => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(furredGhost(FurType.vairy));
    expect(showing().querySelector('.showing__note')?.textContent).toMatch(/Vair is a tincture/);
  });

  test('shows no further arms for a furred field: nothing about it is counted', async () => {
    mount(<DivisionsPage />);
    await userEvent.setup().click(furredGhost(FurType.vairy));
    expect(variants()).toBeNull();
  });
});
