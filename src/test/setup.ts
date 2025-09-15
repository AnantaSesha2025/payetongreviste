// Import polyfills first - this must be done before any other imports
import './polyfills';

import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock IntersectionObserver for tests
class MockIntersectionObserver implements IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = Object.freeze([]);

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    // Store callback for potential future use
    this.callback = callback;
    this.options = options;
  }

  private callback: IntersectionObserverCallback;
  private options?: IntersectionObserverInit;

  observe() {
    // Mock implementation - do nothing
  }

  unobserve() {
    // Mock implementation - do nothing
  }

  disconnect() {
    // Mock implementation - do nothing
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// Mock IntersectionObserver globally
globalThis.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver for tests
class MockResizeObserver implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  private callback: ResizeObserverCallback;

  observe() {
    // Mock implementation - do nothing
  }

  unobserve() {
    // Mock implementation - do nothing
  }

  disconnect() {
    // Mock implementation - do nothing
  }
}

globalThis.ResizeObserver = MockResizeObserver;

// Mock matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo for tests
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock localStorage for tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage for tests
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});
