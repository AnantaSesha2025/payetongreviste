import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GestureRecognizer.css';

/**
 * GestureRecognizer component that detects a specific gesture pattern
 * Pattern: tap tap tap swipe right swipe left
 * When detected, navigates to the activist page
 */
const GestureRecognizer: React.FC = () => {
  const navigate = useNavigate();
  const gestureSequence = useRef<string[]>([]);
  const lastTapTime = useRef<number>(0);
  const tapThreshold = 300; // ms between taps
  const swipeThreshold = 50; // minimum distance for swipe
  const sequenceTimeout = useRef<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Expected pattern: tap, tap, tap, swipe-right, swipe-left
  const expectedPattern = ['tap', 'tap', 'tap', 'swipe-right', 'swipe-left'];

  /**
   * Clears the gesture sequence after a timeout
   */
  const clearSequence = () => {
    gestureSequence.current = [];
    if (sequenceTimeout.current) {
      clearTimeout(sequenceTimeout.current);
      sequenceTimeout.current = null;
    }
  };

  /**
   * Checks if the current sequence matches the expected pattern
   */
  const checkPattern = () => {
    const currentSequence = gestureSequence.current;
    if (currentSequence.length === expectedPattern.length) {
      const matches = expectedPattern.every((gesture, index) => 
        currentSequence[index] === gesture
      );
      
      if (matches) {
        // Pattern detected! Navigate to activist page
        setShowFeedback(true);
        setTimeout(() => {
          navigate('/activist');
          setShowFeedback(false);
        }, 500);
        clearSequence();
      } else {
        // Pattern doesn't match, clear sequence
        clearSequence();
      }
    }
  };

  /**
   * Handles tap gestures
   */
  const handleTap = (event: TouchEvent | MouseEvent) => {
    event.preventDefault();
    const now = Date.now();
    
    // Check if this is a quick tap (not a long press)
    if (now - lastTapTime.current < tapThreshold) {
      gestureSequence.current.push('tap');
      lastTapTime.current = now;
      
      // Clear any existing timeout
      if (sequenceTimeout.current) {
        clearTimeout(sequenceTimeout.current);
      }
      
      // Set new timeout to clear sequence
      sequenceTimeout.current = setTimeout(clearSequence, 2000);
      
      checkPattern();
    }
  };

  /**
   * Handles swipe gestures
   */
  const handleSwipe = (startX: number, endX: number, startY: number, endY: number) => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    // Check if it's a horizontal swipe (not vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
      const direction = deltaX > 0 ? 'swipe-right' : 'swipe-left';
      gestureSequence.current.push(direction);
      
      // Clear any existing timeout
      if (sequenceTimeout.current) {
        clearTimeout(sequenceTimeout.current);
      }
      
      // Set new timeout to clear sequence
      sequenceTimeout.current = setTimeout(clearSequence, 2000);
      
      checkPattern();
    }
  };

  /**
   * Handles touch start events
   */
  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startTime = Date.now();
    
    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endTouch = endEvent.changedTouches[0];
      const endX = endTouch.clientX;
      const endY = endTouch.clientY;
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      
      // If it's a quick, short movement, it's a tap
      if (duration < 200 && distance < 10) {
        handleTap(endEvent);
      } else {
        // Otherwise, it's a swipe
        handleSwipe(startX, endX, startY, endY);
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  };

  /**
   * Handles mouse events for desktop testing
   */
  const handleMouseDown = (event: MouseEvent) => {
    const startX = event.clientX;
    const startY = event.clientY;
    const startTime = Date.now();
    
    const handleMouseUp = (endEvent: MouseEvent) => {
      const endX = endEvent.clientX;
      const endY = endEvent.clientY;
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      
      // If it's a quick, short movement, it's a tap
      if (duration < 200 && distance < 10) {
        handleTap(endEvent);
      } else {
        // Otherwise, it's a swipe
        handleSwipe(startX, endX, startY, endY);
      }
      
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    // Add event listeners for touch and mouse events
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('mousedown', handleMouseDown);
    
    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('mousedown', handleMouseDown);
      if (sequenceTimeout.current) {
        clearTimeout(sequenceTimeout.current);
      }
    };
  }, []);

  return (
    <>
      {showFeedback && (
        <div className="gesture-feedback">
          <div className="gesture-feedback-content">
            <div className="gesture-icon">🎯</div>
            <div className="gesture-text">Gesture detected!</div>
          </div>
        </div>
      )}
    </>
  );
};

export default GestureRecognizer;
