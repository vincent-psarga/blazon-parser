// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { isDivision, isFurred, isVariation } from '../../src/domain/models/Field';
import { METALS, Tincture, isFur } from '../../src/domain/models/Tinctures';
import { mount } from '../testing/Mounting';
import { LANGUAGES, LanguageCode } from '../utils/Languages';
import { readingPath } from '../utils/Reading';
import { ConventionsPage } from './ConventionsPage';

afterEach(cleanup);

/** One worked pair on the page: what was typed, and what came back of it. */
interface Case {
  readonly typed: string;
  /** The tongue it was typed in, which the page says of every blazon it shows. */
  readonly language: LanguageCode;
  readonly written: readonly string[];
  readonly refused: string | undefined;
  readonly arms: number;
}

const cases = (): readonly Case[] =>
  Array.from(document.querySelectorAll('.case')).map((shown) => ({
    typed: shown.querySelector('.case__typed')?.textContent ?? '',
    language: shown.querySelector('.case__typed')?.getAttribute('lang') as LanguageCode,
    written: Array.from(shown.querySelectorAll('.case__written a')).map(
      (link) => link.textContent ?? ''
    ),
    refused: shown.querySelector('.case__refused')?.textContent ?? undefined,
    arms: shown.querySelectorAll('img').length,
  }));

const shown = (typed: string): Case => {
  const found = cases().find((one) => one.typed === typed);
  expect(found, `no case typed «${typed}»`).toBeDefined();
  return found!;
};

/** What the library answers, asked of it directly rather than of the page. */
const answered = (typed: string, read: LanguageCode, written: LanguageCode) =>
  LANGUAGES[written].writer.write(LANGUAGES[read].parser.parse(typed));

const HEADINGS = [
  'One spelling for each term',
  'English counts the pieces, French counts only when it must',
  'A name that means a tincture is written without one',
  'A tincture that has a name of its own is written by it',
  'The smaller settlements',
];

describe('ConventionsPage', () => {
  test('says what the page is before any rule is read', () => {
    mount(<ConventionsPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Conventions');
    expect(screen.getByText(/Several blazons in · one blazon out/)).toBeInTheDocument();
  });

  test.each(HEADINGS)('states the rule: %s', (heading) => {
    mount(<ConventionsPage />);
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });

  test('gives each rule a place of its own, so one may be sent without the rest', () => {
    mount(<ConventionsPage />);
    const rules = Array.from(document.querySelectorAll('.rule'));
    expect(rules).toHaveLength(HEADINGS.length);
    for (const rule of rules) {
      expect(rule.id).not.toBe('');
    }
  });

  test('works every pair through the library rather than quoting one', () => {
    mount(<ConventionsPage />);
    for (const { typed, language, written, refused } of cases()) {
      if (refused !== undefined) {
        expect(() => LANGUAGES[language].parser.parse(typed)).toThrow(refused);
        continue;
      }
      expect(written).toEqual([answered(typed, language, 'fr'), answered(typed, language, 'en')]);
    }
  });

  test('offers every written blazon as a way to the reading of it', () => {
    mount(<ConventionsPage />);
    for (const link of Array.from(document.querySelectorAll('.case__written a'))) {
      const blazon = link.textContent ?? '';
      const language = link.getAttribute('lang') as LanguageCode;
      expect(link).toHaveAttribute('href', readingPath(blazon, language));
    }
  });
});

describe('what each rule shows', () => {
  test('writes one spelling of the several it reads', () => {
    mount(<ConventionsPage />);
    expect(shown('Argent a border gules').written).toContain('Argent a bordure gules.');
    expect(shown('Azure a bezant').written).toContain('Azure a besant.');
    expect(shown('Pily counter pily of four or and azure').written).toContain(
      'Pily of four or and azure.'
    );
    expect(shown("D'argent au losange de gueules").written).toContain(
      "D'argent à la losange de gueules."
    );
    expect(shown("D'or aux trois tourteaux de gueules").written).toContain(
      "D'or à trois tourteaux de gueules."
    );
  });

  test('counts the pieces in English and keeps quiet about the usual number in French', () => {
    mount(<ConventionsPage />);
    expect(shown('Barry or and azure').written).toEqual([
      "Fascé d'or et d'azur.",
      'Barry of six or and azure.',
    ]);
    expect(shown("Bandé d'or et d'azur de six pièces").written).toContain("Bandé d'or et d'azur.");
    expect(shown("Bandé d'or et d'azur de huit pièces").written).toContain(
      "Bandé d'or et d'azur de huit pièces."
    );
  });

  test('drops a tincture the name has already said', () => {
    mount(<ConventionsPage />);
    expect(shown("D'azur au besant d'or").written).toEqual([
      "D'azur au besant.",
      'Azure a besant.',
    ]);
  });

  test('keeps the tincture where the name means no single one', () => {
    mount(<ConventionsPage />);
    expect(shown("D'or au tourteau de gueules").written).toContain("D'or au tourteau de gueules.");
  });

  test('refuses a tincture the name cannot mean, and draws no arms for it', () => {
    mount(<ConventionsPage />);
    const refused = shown('Azure a besant argent');
    expect(refused.refused).toBe('Wrong tincture: besant is never argent');
    expect(refused.written).toEqual([]);
    expect(refused.arms).toBe(0);
  });

  test('writes the name the tincture has, where it has one', () => {
    mount(<ConventionsPage />);
    expect(shown('Azure a roundel or').written).toContain('Azure a besant.');
    expect(shown('Or three roundels gules').written).toContain('Or three torteaux.');
    expect(shown('Azure a roundel argent').written).toContain('Azure a plate.');
  });

  test('writes the plain name where the tincture has none', () => {
    mount(<ConventionsPage />);
    expect(shown('Azure a roundel ermine').written).toContain('Azure a roundel ermine.');
  });

  test('parts one charge from the next, and writes the blazon as a sentence', () => {
    mount(<ConventionsPage />);
    expect(shown('or a chief gules a bordure azure').written).toContain(
      'Or a chief gules, a bordure azure.'
    );
  });
});

describe('the arms beside a case', () => {
  test('draws the one shield both blazons describe, the reading having changed nothing', () => {
    mount(<ConventionsPage />);
    for (const { typed, refused, arms } of cases()) {
      expect(arms, `arms beside «${typed}»`).toBe(refused === undefined ? 1 : 0);
    }
  });

  test('leaves the arms unnamed, the blazon beside them already naming them', () => {
    mount(<ConventionsPage />);
    const first = document.querySelector('.case img');
    expect(first).toHaveAttribute('alt', '');
  });
});

/**
 * The arms a rule is shown by are arms first: a reader learning heraldry off this
 * page must not be taught a blazon no herald would grant. A fur is neither metal
 * nor colour and answers to nothing here, and a field divided between two
 * tinctures is exempt by the rule's own terms — so what is checked is a plain
 * field and what is laid on it.
 */
const rank = (tincture: Tincture) =>
  isFur(tincture) ? 'fur' : METALS.includes(tincture as never) ? 'metal' : 'colour';

describe('the rule of tincture, which every example must keep', () => {
  test('lays no metal on metal and no colour on colour', () => {
    mount(<ConventionsPage />);
    for (const { typed, language, refused } of cases()) {
      if (refused !== undefined) {
        continue;
      }
      const blazon = LANGUAGES[language].parser.parse(typed);
      const { field } = blazon;
      if (isDivision(field) || isVariation(field) || isFurred(field)) {
        continue;
      }
      const ground = rank(field.tincture);
      for (const borne of blazon.chargesOrOrdinaries ?? []) {
        const laid = rank(borne.tincture);
        expect(
          ground === 'fur' || laid === 'fur' || ground !== laid,
          `«${typed}» lays ${laid} on ${ground}`
        ).toBe(true);
      }
    }
  });
});

describe('the authorities the decisions rest on', () => {
  test.each([
    ['https://www.heraldry.ca/resources/BLAZONRY_GUIDE_2014.pdf'],
    ['http://www.blason-armoiries.org/heraldique/b/bandee.htm'],
    ['https://www.heraldsnet.org/saitou/parker/Jpglossr.htm'],
    ['http://www.blason-armoiries.org/heraldique/b/besant.htm'],
    ['http://www.blason-armoiries.org/heraldique/l/losange.htm'],
  ])('cites %s', (href) => {
    mount(<ConventionsPage />);
    expect(document.querySelector(`.rule__source a[href="${href}"]`)).toBeInTheDocument();
  });

  test('names the guide that says English counts every time', () => {
    mount(<ConventionsPage />);
    const rule = document.querySelector('#counting-the-pieces') as HTMLElement;
    expect(
      within(rule).getByText(/always stating the number and the tinctures involved/)
    ).toBeInTheDocument();
  });
});
