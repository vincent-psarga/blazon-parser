// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Rest, Side } from './Side';

afterEach(cleanup);

describe('what a slide sets aside', () => {
  test('stands apart from the rest of the slide, each knowing which it is', () => {
    const { container } = render(
      <>
        <Side>Some arms</Side>
        <Rest>What they are about</Rest>
      </>
    );
    expect(container.querySelector('.deck__side')?.textContent).toBe('Some arms');
    expect(container.querySelector('.deck__rest')?.textContent).toBe('What they are about');
  });

  test('holds more than a line, a side being a stretch of a deck', () => {
    render(
      <Side>
        <h2>A heading</h2>
        <p>And what stands under it</p>
      </Side>
    );
    expect(screen.getByRole('heading', { name: 'A heading' })).toBeInTheDocument();
    expect(screen.getByText('And what stands under it')).toBeInTheDocument();
  });
});
