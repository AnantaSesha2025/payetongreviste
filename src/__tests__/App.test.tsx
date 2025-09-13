import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the CSS imports
vi.mock('../App.css', () => ({}));
vi.mock('../pages/DiscoverPage', () => ({
  __esModule: true,
  default: () => <div data-testid="discover-page">Discover Page</div>,
}));
vi.mock('../pages/MatchesPage', () => ({
  __esModule: true,
  default: () => <div data-testid="matches-page">Matches Page</div>,
}));
vi.mock('../pages/ActivistSetupPage', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="activist-setup-page">Activist Setup Page</div>
  ),
}));
vi.mock('../components/Toast', () => ({
  ToastContainer: () => (
    <div data-testid="toast-container">Toast Container</div>
  ),
  useToast: () => ({
    toasts: [],
    removeToast: vi.fn(),
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('App', () => {
  it('renders the main app structure', () => {
    renderWithRouter(<App />);

    expect(screen.getByRole('banner')).toBeInTheDocument(); // app-header
    expect(screen.getByRole('main')).toBeInTheDocument(); // app-main
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav
  });

  it('renders navigation links', () => {
    renderWithRouter(<App />);

    expect(screen.getByText('Découvrir')).toBeInTheDocument();
    expect(screen.getByText('Matches')).toBeInTheDocument();
  });

  it('renders Discover page by default', () => {
    renderWithRouter(<App />);

    expect(screen.getByTestId('discover-page')).toBeInTheDocument();
  });

  it('renders ToastContainer', () => {
    renderWithRouter(<App />);

    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  it('has proper navigation structure', () => {
    renderWithRouter(<App />);

    const nav = screen.getByRole('navigation');
    const links = nav.querySelectorAll('a');

    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/matches');
    expect(links[2]).toHaveAttribute('href', '/gist-demo');
  });

  it('has proper main content area', () => {
    renderWithRouter(<App />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('app-main');
  });

  it('has proper header area', () => {
    renderWithRouter(<App />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('app-header');
  });
});
