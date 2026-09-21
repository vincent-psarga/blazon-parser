import '@testing-library/jest-dom/vitest';

// jsdom implements no scrolling and the router scrolls on every navigation. The
// guard matters because this file also loads for the suites that run in node,
// where there is no window at all.
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
  // Nor does it scroll an element into view, which is how a reference answers a
  // struck term on a screen too narrow to hold the reading beside the set.
  Element.prototype.scrollIntoView = () => {};

  // Nor does it lay anything out: an element has no rectangles at all, where
  // the presenter measures the box it was given so as to scale a deck into it.
  // A stated size is enough — nothing here asserts on how large a slide is drawn.
  Element.prototype.getClientRects = function getClientRects() {
    const rect = {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 1366,
      bottom: 768,
      width: 1366,
      height: 768,
    };
    return Object.assign([rect], {
      item: (index: number) => (index === 0 ? rect : null),
    }) as unknown as DOMRectList;
  };

  // And it watches nothing for resizing, there being nothing laid out to resize.
  window.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
