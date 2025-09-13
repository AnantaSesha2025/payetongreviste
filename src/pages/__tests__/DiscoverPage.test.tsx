import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import DiscoverPage from '../DiscoverPage';

// Mock the SwipeDeck component
vi.mock('../../components/SwipeDeck', () => ({
  SwipeDeck: () => <div data-testid="swipe-deck">SwipeDeck Component</div>,
}));

const DiscoverPageWithRouter = () => (
  <BrowserRouter>
    <DiscoverPage />
  </BrowserRouter>
);

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('DiscoverPage Component', () => {
  beforeEach(() => {
    // Mock localStorage to return that user has seen onboarding
    mockLocalStorage.getItem.mockReturnValue('true');
  });

  it('renders SwipeDeck component', () => {
    render(<DiscoverPageWithRouter />);

    expect(screen.getByTestId('swipe-deck')).toBeInTheDocument();
  });

  it('has correct CSS class', () => {
    render(<DiscoverPageWithRouter />);

    const discoverElement = screen
      .getByText('Découvrir les Activistes')
      .closest('.discover');
    expect(discoverElement).toHaveClass('discover');
  });

  it('renders discover header with title only', () => {
    render(<DiscoverPageWithRouter />);

    expect(screen.getByText('Découvrir les Activistes')).toBeInTheDocument();
    expect(screen.queryByText('Créer Votre Profil')).not.toBeInTheDocument();
  });

  it('does not have create profile button (hidden as requested)', () => {
    render(<DiscoverPageWithRouter />);

    const createButton = screen.queryByText('Create Profile');
    expect(createButton).not.toBeInTheDocument();
  });

  it('has discover header with correct CSS class', () => {
    render(<DiscoverPageWithRouter />);

    const headerElement = screen
      .getByText('Découvrir les Activistes')
      .closest('div');
    expect(headerElement).toHaveClass('discover-header');
  });
});
