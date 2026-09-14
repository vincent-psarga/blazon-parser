import '@testing-library/jest-dom/vitest';

// jsdom implements no scrolling and the router scrolls on every navigation. The
// guard matters because this file also loads for the suites that run in node,
// where there is no window at all.
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}
