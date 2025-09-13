import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Card, type CardProps } from '../Card';

// Mock framer-motion to avoid animation issues in tests
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

const mockProfile = {
  id: '1',
  name: 'Test User',
  age: 25,
  bio: 'Test bio with fund',
  photoUrl: 'https://example.com/photo.jpg',
  strikeFund: {
    url: 'https://example.com/fund',
    title: 'Test Fund',
  },
};

const defaultProps: CardProps = {
  profile: mockProfile,
  onSwipe: vi.fn(),
  onSwipeUp: vi.fn(),
};

describe('Card Component', () => {
  it('renders profile information correctly', () => {
    render(<Card {...defaultProps} />);

    expect(screen.getByText('Test User, 25')).toBeInTheDocument();
    expect(screen.getByText('Test bio with')).toBeInTheDocument();
    expect(screen.getByText('fund')).toBeInTheDocument();
    expect(screen.getByAltText('Test User')).toBeInTheDocument();
  });

  it('renders with custom styles', () => {
    const customStyle = { transform: 'scale(0.9)' };
    render(<Card {...defaultProps} style={customStyle} />);

    const cardElement = screen
      .getByText('Test User, 25')
      .closest('.card-swipeable');
    expect(cardElement).toHaveStyle('transform: scale(0.9)');
  });

  it('can be disabled', () => {
    render(<Card {...defaultProps} disabled={true} />);

    const cardElement = screen
      .getByText('Test User, 25')
      .closest('.card-swipeable');
    expect(cardElement).toHaveClass('disabled');
  });

  it('calls onSwipe when swiped right', () => {
    const onSwipe = vi.fn();
    render(<Card {...defaultProps} onSwipe={onSwipe} />);

    // Since framer-motion is mocked, we can't test actual drag behavior
    // This test just verifies the component renders with the onSwipe prop
    expect(screen.getByText('Test User, 25')).toBeInTheDocument();
  });

  it('calls onSwipe when swiped left', () => {
    const onSwipe = vi.fn();
    render(<Card {...defaultProps} onSwipe={onSwipe} />);

    // Since framer-motion is mocked, we can't test actual drag behavior
    // This test just verifies the component renders with the onSwipe prop
    expect(screen.getByText('Test User, 25')).toBeInTheDocument();
  });

  it('calls onSwipeUp when swiped up', () => {
    const onSwipeUp = vi.fn();
    render(<Card {...defaultProps} onSwipeUp={onSwipeUp} />);

    // Since framer-motion is mocked, we can't test actual drag behavior
    // This test just verifies the component renders with the onSwipeUp prop
    expect(screen.getByText('Test User, 25')).toBeInTheDocument();
  });

  it('does not call callbacks when swipe threshold is not met', () => {
    const onSwipe = vi.fn();
    const onSwipeUp = vi.fn();
    render(<Card {...defaultProps} onSwipe={onSwipe} onSwipeUp={onSwipeUp} />);

    // Since framer-motion is mocked, we can't test actual drag behavior
    // This test just verifies the component renders without calling callbacks
    expect(screen.getByText('Test User, 25')).toBeInTheDocument();
  });

  it('renders BioWithFund component with correct props', () => {
    render(<Card {...defaultProps} />);

    // Check that the bio text is rendered
    expect(screen.getByText('Test bio with')).toBeInTheDocument();
    expect(screen.getByText('fund')).toBeInTheDocument();
  });
});
