import { ReactElement } from 'react';
import { RenderResult, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

/**
 * A page under test needs somewhere to link into: the pages hand the reader an
 * address rather than a callback, so there is a router wherever they are shown,
 * in a test as in the browser.
 *
 * The address is the test's own to set, which is how a term is reached by the
 * anchor it answers to.
 */
export function mount(ui: ReactElement, at = '/'): RenderResult {
  return render(<MemoryRouter initialEntries={[at]}>{ui}</MemoryRouter>);
}
