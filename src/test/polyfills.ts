// Polyfills for test environment
// This file must be imported before any other modules

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

// Mock URLSearchParams
class MockURLSearchParams {
  private params = new Map<string, string>();

  constructor(
    init?: string | URLSearchParams | Record<string, string> | string[][]
  ) {
    if (init) {
      if (typeof init === 'string') {
        // Simple parsing for test purposes
        init.split('&').forEach(pair => {
          const [key, value] = pair.split('=');
          if (key)
            this.params.set(
              decodeURIComponent(key),
              decodeURIComponent(value || '')
            );
        });
      } else if (init instanceof URLSearchParams) {
        init.forEach((value, key) => this.params.set(key, value));
      } else if (Array.isArray(init)) {
        init.forEach(([key, value]) => this.params.set(key, value));
      } else {
        Object.entries(init).forEach(([key, value]) =>
          this.params.set(key, value)
        );
      }
    }
  }

  get(name: string): string | null {
    return this.params.get(name) || null;
  }

  getAll(name: string): string[] {
    return Array.from(this.params.entries())
      .filter(([key]) => key === name)
      .map(([, value]) => value);
  }

  has(name: string): boolean {
    return this.params.has(name);
  }

  set(name: string, value: string): void {
    this.params.set(name, value);
  }

  delete(name: string): void {
    this.params.delete(name);
  }

  forEach(callback: (value: string, key: string) => void): void {
    this.params.forEach(callback);
  }

  keys(): IterableIterator<string> {
    return this.params.keys();
  }

  values(): IterableIterator<string> {
    return this.params.values();
  }

  entries(): IterableIterator<[string, string]> {
    return this.params.entries();
  }

  toString(): string {
    return Array.from(this.params.entries())
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
  }
}

// Apply polyfills to global scope
if (typeof globalThis !== 'undefined') {
  globalThis.URL = MockURL as unknown as typeof URL;
  globalThis.URLSearchParams =
    MockURLSearchParams as unknown as typeof URLSearchParams;
} else if (typeof global !== 'undefined') {
  global.URL = MockURL as unknown as typeof URL;
  global.URLSearchParams =
    MockURLSearchParams as unknown as typeof URLSearchParams;
} else if (typeof window !== 'undefined') {
  window.URL = MockURL as unknown as typeof URL;
  window.URLSearchParams =
    MockURLSearchParams as unknown as typeof URLSearchParams;
}
