// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { OrdinaryType, bornInNumber } from '../../src/domain/models/Ordinary';
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

const variants = () => showing().querySelector('.showing__variants');
const borne = () => Array.from(showing().querySelectorAll('.showing__variant')) as HTMLElement[];

const IN_NUMBER = ORDINARIES.filter(bornInNumber);
const BUT_ONCE = ORDINARIES.filter((type) => !bornInNumber(type));

describe('OrdinariesPage', () => {
  test('states how many ordinaries there are', () => {
    render(<OrdinariesPage />);
    expect(screen.getByText(/Nine ordinaries/)).toBeInTheDocument();
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

describe('whether an ordinary may be borne in number', () => {
  test.each(ORDINARIES)('says of %s which it is', async (type) => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    const said = showing().querySelector('.showing__note')?.textContent ?? '';
    expect(said).toMatch(bornInNumber(type) ? /^Borne in number\./ : /^Borne but once\./);
  });

  test.each(BUT_ONCE)('gives a reason for %s, which cannot be repeated', async (type) => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    // Not merely that it may not, but why — a shield has one top, and a cross is
    // one charge however many arms it is drawn with.
    expect(showing().querySelector('.showing__note')?.textContent ?? '').toMatch(
      /one top|one charge/
    );
  });

  test.each(BUT_ONCE)('shows no further arms for %s', async (type) => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    expect(variants()).toBeNull();
  });

  test.each(IN_NUMBER)('draws %s twice and thrice beside the one', async (type) => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(type));
    expect(borne().map((figure) => figure.querySelector('b')?.textContent)).toEqual([
      'Twice',
      'Thrice',
    ]);
  });

  test.each(IN_NUMBER)(
    'writes both counts of %s as blazons the parser reads back',
    async (type) => {
      render(<OrdinariesPage />);
      await userEvent.setup().click(ghost(type));
      const parser = new FrenchBlazonParser();
      const written = borne().map(
        (figure) => figure.querySelector('[lang="fr"]')?.textContent ?? ''
      );
      expect(parser.parse(written[0]).ordinary).toMatchObject({ type, count: 2 });
      expect(parser.parse(written[1]).ordinary).toMatchObject({ type, count: 3 });
    }
  );

  test('names the further arms in both languages', async () => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.chevron));
    const [twice] = borne();
    expect(twice.querySelector('[lang="fr"]')).toHaveTextContent(
      "D'argent à deux chevrons de gueules."
    );
    expect(twice.querySelector('[lang="en"]')).toHaveTextContent('Argent two chevrons gules.');
  });

  test('paints the further arms with as many bands as are counted', async () => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.fess));
    const bands = (figure: HTMLElement) =>
      (
        decodeURIComponent(figure.querySelector('img')?.getAttribute('src') ?? '').match(
          /<rect/g
        ) ?? []
      ).length;
    const [twice, thrice] = borne();
    expect(bands(twice)).toBe(2);
    expect(bands(thrice)).toBe(3);
  });

  test('keeps the further arms smaller than the struck ones', async () => {
    render(<OrdinariesPage />);
    await userEvent.setup().click(ghost(OrdinaryType.fess));
    const struck = Number(
      showing().querySelector('.showing__field img')?.getAttribute('width') ?? 0
    );
    const further = Number(borne()[0]?.querySelector('img')?.getAttribute('width') ?? 0);
    expect(further).toBeLessThan(struck);
  });
});

describe('what the page offers to read', () => {
  test('keeps the further arms below the button, which reads the one above it', async () => {
    render(<OrdinariesPage onTry={() => {}} />);
    await userEvent.setup().click(ghost(OrdinaryType.chevron));
    const read = showing().querySelector('.showing__try') as HTMLElement;
    const further = variants() as HTMLElement;
    // Standing between the blazon and the button would leave the reader
    // guessing which of the two the button takes.
    expect(read.compareDocumentPosition(further) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('hands over the single blazon, not one of the counted ones', async () => {
    const read: string[] = [];
    render(<OrdinariesPage onTry={(blazon) => read.push(blazon)} />);
    const user = userEvent.setup();
    await user.click(ghost(OrdinaryType.chevron));
    await user.click(screen.getByRole('button', { name: /read this one/i }));
    expect(read).toEqual(["D'argent au chevron de gueules."]);
  });
});
