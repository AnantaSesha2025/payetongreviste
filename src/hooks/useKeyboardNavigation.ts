import { useCallback, useEffect, useRef } from 'react';

interface KeyboardNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onDetails?: () => void;
  enabled?: boolean;
}

/**
 * Hook for handling keyboard navigation in swipe interfaces
 * Provides keyboard shortcuts for swipe actions
 */
export function useKeyboardNavigation({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onDetails,
  enabled = true,
}: KeyboardNavigationOptions) {
  const elementRef = useRef<HTMLElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Prevent default behavior for our custom keys
      const handledKeys = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'Enter',
        'Space',
        'Escape',
      ];
      if (handledKeys.includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onSwipeLeft?.();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onSwipeRight?.();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          onSwipeUp?.();
          break;
        case 'Enter':
        case ' ':
          onDetails?.();
          break;
        case 'Escape':
          // Close any open modals or details
          break;
      }
    },
    [enabled, onSwipeLeft, onSwipeRight, onSwipeUp, onDetails]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  return { elementRef };
}

/**
 * Hook for managing focus in modal dialogs
 */
export function useFocusManagement() {
  const focusRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, []);

  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => element.removeEventListener('keydown', handleTabKey);
  }, []);

  return { focusRef, saveFocus, restoreFocus, trapFocus };
}
