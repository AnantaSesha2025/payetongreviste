import '@testing-library/jest-dom';

// Mock IntersectionObserver for tests
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    // Immediately trigger the callback with isIntersecting: true
    setTimeout(() => {
      callback([{ isIntersecting: true } as IntersectionObserverEntry], this);
    }, 0);
  }
  disconnect() {}
  observe() {}
  unobserve() {}
}

class MockResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});
