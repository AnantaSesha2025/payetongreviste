import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import GestureRecognizer from '../GestureRecognizer';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/**
 * Test wrapper component that provides router context
 */
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('GestureRecognizer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <GestureRecognizer />
      </TestWrapper>
    );
  });

  it('detects tap tap tap swipe right swipe left pattern', async () => {
    render(
      <TestWrapper>
        <GestureRecognizer />
      </TestWrapper>
    );

    // Simulate tap tap tap
    for (let i = 0; i < 3; i++) {
      fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
      fireEvent.mouseUp(document, { clientX: 100, clientY: 100 });
      vi.advanceTimersByTime(100);
    }

    // Simulate swipe right
    fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(document, { clientX: 200, clientY: 100 });
    vi.advanceTimersByTime(100);

    // Simulate swipe left
    fireEvent.mouseDown(document, { clientX: 200, clientY: 100 });
    fireEvent.mouseUp(document, { clientX: 50, clientY: 100 });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/activist');
    });
  });

  it('shows feedback when pattern is detected', async () => {
    render(
      <TestWrapper>
        <GestureRecognizer />
      </TestWrapper>
    );

    // Simulate the complete pattern
    for (let i = 0; i < 3; i++) {
      fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
      fireEvent.mouseUp(document, { clientX: 100, clientY: 100 });
      vi.advanceTimersByTime(100);
    }

    fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(document, { clientX: 200, clientY: 100 });
    vi.advanceTimersByTime(100);

    fireEvent.mouseDown(document, { clientX: 200, clientY: 100 });
    fireEvent.mouseUp(document, { clientX: 50, clientY: 100 });

    await waitFor(() => {
      expect(screen.getByText('Gesture detected!')).toBeInTheDocument();
    });
  });

  it('clears sequence after timeout', async () => {
    render(
      <TestWrapper>
        <GestureRecognizer />
      </TestWrapper>
    );

    // Simulate partial pattern
    fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(document, { clientX: 100, clientY: 100 });

    // Advance time beyond timeout
    vi.advanceTimersByTime(3000);

    // Try to complete pattern - should not work
    for (let i = 0; i < 2; i++) {
      fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
      fireEvent.mouseUp(document, { clientX: 100, clientY: 100 });
      vi.advanceTimersByTime(100);
    }

    fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(document, { clientX: 200, clientY: 100 });
    vi.advanceTimersByTime(100);

    fireEvent.mouseDown(document, { clientX: 200, clientY: 100 });
    fireEvent.mouseUp(document, { clientX: 50, clientY: 100 });

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('does not detect incorrect patterns', async () => {
    render(
      <TestWrapper>
        <GestureRecognizer />
      </TestWrapper>
    );

    // Simulate wrong pattern: tap tap swipe right swipe left (missing one tap)
    for (let i = 0; i < 2; i++) {
      fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
      fireEvent.mouseUp(document, { clientX: 100, clientY: 100 });
      vi.advanceTimersByTime(100);
    }

    fireEvent.mouseDown(document, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(document, { clientX: 200, clientY: 100 });
    vi.advanceTimersByTime(100);

    fireEvent.mouseDown(document, { clientX: 200, clientY: 100 });
    fireEvent.mouseUp(document, { clientX: 50, clientY: 100 });

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('handles touch events', async () => {
    render(
      <TestWrapper>
        <GestureRecognizer />
      </TestWrapper>
    );

    // Simulate touch events
    const touchStartEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 100 } as Touch],
    });
    const touchEndEvent = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 100, clientY: 100 } as Touch],
    });

    // Simulate tap tap tap swipe right swipe left with touch
    for (let i = 0; i < 3; i++) {
      fireEvent(document, touchStartEvent);
      fireEvent(document, touchEndEvent);
      vi.advanceTimersByTime(100);
    }

    // Swipe right
    const swipeRightStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 100 } as Touch],
    });
    const swipeRightEnd = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 200, clientY: 100 } as Touch],
    });
    fireEvent(document, swipeRightStart);
    fireEvent(document, swipeRightEnd);
    vi.advanceTimersByTime(100);

    // Swipe left
    const swipeLeftStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 200, clientY: 100 } as Touch],
    });
    const swipeLeftEnd = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 50, clientY: 100 } as Touch],
    });
    fireEvent(document, swipeLeftStart);
    fireEvent(document, swipeLeftEnd);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/activist');
    });
  });
});
