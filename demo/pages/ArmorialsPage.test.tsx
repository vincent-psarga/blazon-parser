// @vitest-environment jsdom
import { cleanup, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Armorial } from '../../src/domain/models/Armorial';
import { Languages } from '../../src/domain/models/Languages';
import { mount } from '../testing/Mounting';
import { ArmorialsPage, armorialPath } from './ArmorialsPage';

afterEach(cleanup);

const ONE: Armorial = {
  name: 'A sample armorial',
  slug: 'sample',
  language: Languages.fr,
  licence: 'MIT',
  entries: [
    { name: 'Halberstadt', blazon: "Parti d'argent et de gueules", image: '' },
    { name: 'France', blazon: "D'azur", image: '' },
  ],
};

const ANOTHER: Armorial = {
  name: 'A roll of English arms',
  slug: 'english-roll',
  language: Languages.en,
  licence: 'CC BY-SA 4.0',
  entries: [{ name: 'Somewhere', blazon: 'Per pale argent and gules', image: '' }],
};

const index = () => screen.getByRole('navigation', { name: 'Armorials' });
const entry = (name: string) => within(index()).getByRole('link', { name: new RegExp(name) });

describe('ArmorialsPage', () => {
  test('states how many armorials there are, and how much they hold', () => {
    mount(<ArmorialsPage armorials={[ONE, ANOTHER]} />);
    expect(screen.getByText(/armorials/)).toHaveTextContent('2 armorials · 3 entries');
  });

  test('counts a lone armorial in the singular', () => {
    mount(<ArmorialsPage armorials={[ANOTHER]} />);
    expect(screen.getByText(/armorial /)).toHaveTextContent('1 armorial · 1 entry');
  });

  test('names every armorial it is given', () => {
    mount(<ArmorialsPage armorials={[ONE, ANOTHER]} />);
    expect(within(index()).getAllByRole('link')).toHaveLength(2);
    expect(entry('A sample armorial')).toBeInTheDocument();
    expect(entry('A roll of English arms')).toBeInTheDocument();
  });

  test('points each one at where it is read', () => {
    mount(<ArmorialsPage armorials={[ONE]} />);
    expect(entry('A sample armorial')).toHaveAttribute('href', '/armorial/sample');
  });

  test('says what each one holds, in which tongue, and under which licence', () => {
    mount(<ArmorialsPage armorials={[ONE, ANOTHER]} />);
    expect(entry('A sample armorial')).toHaveTextContent('2 entries · French · MIT');
    expect(entry('A roll of English arms')).toHaveTextContent('1 entry · English · CC BY-SA 4.0');
  });
});

describe('the address of an armorial', () => {
  test('is its slug, so the index and whatever routes agree', () => {
    expect(armorialPath(ONE)).toBe('/armorial/sample');
  });
});
