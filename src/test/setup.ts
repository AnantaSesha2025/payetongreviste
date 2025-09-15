import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock URL constructor for tests to avoid webidl-conversions errors
class MockURL {
  href: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  host: string;
  origin: string;

  constructor(url: string, base?: string) {
    // Simple URL validation for tests
    if (!url || typeof url !== 'string') {
      throw new TypeError('Invalid URL');
    }

    // Handle relative URLs (like "/" used by React Router)
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      // For relative URLs, use a base URL or default to localhost
      const baseUrl = base || 'http://localhost:3000';
      url = baseUrl + (url.startsWith('/') ? url : '/' + url);
    }

    // Basic URL parsing for test purposes
    try {
      // Simple regex-based URL parsing for tests
      const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new Error('Invalid URL format');
      }

      this.href = url;
      this.protocol = url.startsWith('https') ? 'https:' : 'http:';
      this.hostname = url
        .replace(/^https?:\/\//, '')
        .split('/')[0]
        .split(':')[0];
      this.port =
        url.includes(':') && !url.includes('://')
          ? url.split(':')[1].split('/')[0]
          : '';
      this.pathname = url.includes('/')
        ? '/' + url.split('/').slice(3).join('/').split('?')[0]
        : '/';
      this.search = url.includes('?')
        ? '?' + url.split('?')[1].split('#')[0]
        : '';
      this.hash = url.includes('#') ? '#' + url.split('#')[1] : '';
      this.host = this.hostname + (this.port ? ':' + this.port : '');
      this.origin = this.protocol + '//' + this.host;
    } catch {
      throw new TypeError(`Invalid URL: ${url}`);
    }
  }

  toString() {
    return this.href;
  }
}

globalThis.URL = MockURL as unknown as typeof URL;

// Mock IntersectionObserver for tests
class MockIntersectionObserver implements IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = Object.freeze([]);

  constructor(callback: IntersectionObserverCallback) {
    // Immediately trigger the callback with isIntersecting: true
    setTimeout(() => {
      callback([{ isIntersecting: true } as IntersectionObserverEntry], this);
    }, 0);
  }
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
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

// Mock HTMLCanvasElement getContext method
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  configurable: true,
  value: vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Array(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Array(4) })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    createPattern: vi.fn(),
    setLineDash: vi.fn(),
    getLineDash: vi.fn(() => []),
    setLineDashOffset: vi.fn(),
    lineDashOffset: 0,
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: 'rgba(0, 0, 0, 0)',
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'low',
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    direction: 'inherit',
  })),
});

// Clean up after each test to prevent test pollution
afterEach(() => {
  cleanup();
});
