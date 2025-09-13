import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { SwipeDeck } from '../SwipeDeck';
import { useAppStore } from '../../store';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
  useAnimation: () => ({
    start: vi.fn(),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock the store
vi.mock('../../store', () => ({
  useAppStore: vi.fn(),
  mockProfiles: [
    {
      id: '1',
      name: 'Test User 1',
      age: 25,
      bio: 'Test bio 1',
      photoUrl: 'https://example.com/photo1.jpg',
      location: { lat: 48.8566, lon: 2.3522 },
      strikeFund: { url: 'https://example.com/fund1', title: 'Fund 1' },
    },
    {
      id: '2',
      name: 'Test User 2',
      age: 30,
      bio: 'Test bio 2',
      photoUrl: 'https://example.com/photo2.jpg',
      location: { lat: 48.8666, lon: 2.3333 },
      strikeFund: { url: 'https://example.com/fund2', title: 'Fund 2' },
    },
  ],
}));

const mockStore = {
  profiles: [],
  likedIds: new Set(),
  passedIds: new Set(),
  setProfiles: vi.fn(),
  likeProfile: vi.fn(),
  passProfile: vi.fn(),
};

describe('SwipeDeck Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppStore).mockReturnValue(mockStore);
  });

  it('renders empty state when no profiles', () => {
    render(<SwipeDeck onCreateProfile={() => {}} />);

    expect(
      screen.getByText('No more activists to discover right now')
    ).toBeInTheDocument();
  });

  it('renders current profile when available', () => {
    const profiles = [
      {
        id: '1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' },
      },
    ];

    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles,
    });

    render(<SwipeDeck onCreateProfile={() => {}} />);

    expect(screen.getByText('Test User, 25')).toBeInTheDocument(); // Only in card initially
    expect(screen.getByText('Test')).toBeInTheDocument(); // Bio is split into "Test" and "bio" link
    expect(screen.getByText('bio')).toBeInTheDocument(); // Bio is split into "Test" and "bio" link
  });

  it('renders next profile as preview', () => {
    const profiles = [
      {
        id: '1',
        name: 'Current User',
        age: 25,
        bio: 'Current bio',
        photoUrl: 'https://example.com/current.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: {
          url: 'https://example.com/current-fund',
          title: 'Current Fund',
        },
      },
      {
        id: '2',
        name: 'Next User',
        age: 30,
        bio: 'Next bio',
        photoUrl: 'https://example.com/next.jpg',
        location: { lat: 48.8666, lon: 2.3333 },
        strikeFund: {
          url: 'https://example.com/next-fund',
          title: 'Next Fund',
        },
      },
    ];

    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles,
    });

    render(<SwipeDeck onCreateProfile={() => {}} />);

    // Should render both current and next profiles
    expect(screen.getByText('Current User, 25')).toBeInTheDocument();
    expect(screen.getByText('Next User, 30')).toBeInTheDocument();
  });

  it('calls likeProfile when like button is clicked', () => {
    const profiles = [
      {
        id: '1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' },
      },
    ];

    const likeProfile = vi.fn();
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles,
      likeProfile,
    });

    render(<SwipeDeck onCreateProfile={() => {}} />);

    const likeButton = screen.getByLabelText('Like');
    fireEvent.click(likeButton);

    expect(likeProfile).toHaveBeenCalledWith('1');
  });

  it('calls passProfile when pass button is clicked', () => {
    const profiles = [
      {
        id: '1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' },
      },
    ];

    const passProfile = vi.fn();
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles,
      passProfile,
    });

    render(<SwipeDeck onCreateProfile={() => {}} />);

    const passButton = screen.getByLabelText('Pass');
    fireEvent.click(passButton);

    expect(passProfile).toHaveBeenCalledWith('1');
  });

  it('opens details modal when details button is clicked', () => {
    const profiles = [
      {
        id: '1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' },
      },
    ];

    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles,
    });

    render(<SwipeDeck onCreateProfile={() => {}} />);

    const detailsButton = screen.getByLabelText('Details');
    fireEvent.click(detailsButton);

    // Modal should appear with profile details
    expect(screen.getAllByText('Test User, 25')).toHaveLength(2); // One in card, one in modal
    expect(screen.getByText('Test')).toBeInTheDocument(); // Bio is split into "Test" and "bio" link
    expect(screen.getByText('bio')).toBeInTheDocument(); // Bio is split into "Test" and "bio" link
    expect(screen.getByText('Test Fund')).toBeInTheDocument();
  });

  it('closes details modal when close button is clicked', () => {
    const profiles = [
      {
        id: '1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' },
      },
    ];

    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles,
    });

    render(<SwipeDeck onCreateProfile={() => {}} />);

    // Open modal
    const detailsButton = screen.getByLabelText('Details');
    fireEvent.click(detailsButton);

    // Close modal
    const closeButton = screen.getByLabelText('Close details');
    fireEvent.click(closeButton);

    // Modal should be closed
    expect(screen.queryByLabelText('Close details')).not.toBeInTheDocument();
  });

  it('shows swipe indicator in details modal', () => {
    const profiles = [
      {
        id: '1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' },
      },
    ];

    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles,
    });

    render(<SwipeDeck onCreateProfile={() => {}} />);

    // Open modal
    const detailsButton = screen.getByLabelText('Details');
    fireEvent.click(detailsButton);

    // Should show swipe indicator
    expect(screen.getByText('Swipe down to go back')).toBeInTheDocument();
  });
});
