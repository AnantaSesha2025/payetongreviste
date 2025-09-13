import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { BioWithFund } from './BioWithFund';
import type { PanInfo } from 'framer-motion';
import './Card.css';

/**
 * Props for the Card component
 */
export type CardProps = {
  /** Profile data containing user information and strike fund details */
  profile: {
    id: string;
    name: string;
    age: number;
    bio: string;
    photoUrl: string;
    strikeFund: { url: string; title: string };
  };
  /** Callback function triggered when card is swiped left or right */
  onSwipe?: (dir: 'left' | 'right') => void;
  /** Callback function triggered when card is swiped up for details */
  onSwipeUp?: () => void;
  /** Additional CSS styles to apply to the card */
  style?: React.CSSProperties;
  /** Whether the card is disabled (non-draggable) */
  disabled?: boolean;
};

/**
 * A swipeable card component that displays a user profile with drag gestures.
 * Supports swipe left (pass), right (like), and up (details) gestures.
 *
 * @param props - The component props
 * @returns JSX element representing a swipeable profile card
 */
export function Card({
  profile,
  onSwipe,
  onSwipeUp,
  style,
  disabled,
}: CardProps) {
  const controls = useAnimation();
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);

  // Threshold values for determining swipe direction
  const threshold = 80; // Horizontal swipe threshold (reduced for better responsiveness)
  const upThreshold = 100; // Vertical swipe threshold (reduced for better responsiveness)

  /**
   * Handles drag movement to provide visual feedback
   * @param _ - Unused event parameter
   * @param info - Pan gesture information containing offset data
   */
  const handleDrag = (_: unknown, info: PanInfo) => {
    const x = info.offset.x;
    const y = info.offset.y;

    // Provide visual feedback based on drag direction
    if (-y > upThreshold * 0.5) {
      setSwipeDirection('details');
    } else if (x > threshold * 0.5) {
      setSwipeDirection('like');
    } else if (x < -threshold * 0.5) {
      setSwipeDirection('pass');
    } else {
      setSwipeDirection(null);
    }
  };

  /**
   * Handles the end of a drag gesture and determines the swipe direction
   * @param _ - Unused event parameter
   * @param info - Pan gesture information containing offset data
   */
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const x = info.offset.x;
    const y = info.offset.y;

    // Swipe up for details
    if (-y > upThreshold) {
      // Just call the callback without animating the card away
      onSwipeUp?.();
      // Reset the card position smoothly
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: {
          duration: 0.3,
          ease: 'easeOut',
        },
      });
    }
    // Swipe right to like
    else if (x > threshold) {
      controls.start({
        x: 1000,
        rotate: 20,
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smoothness
        },
      });
      onSwipe?.('right');
    }
    // Swipe left to pass
    else if (x < -threshold) {
      controls.start({
        x: -1000,
        rotate: -20,
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smoothness
        },
      });
      onSwipe?.('left');
    }
    // Return to original position if threshold not met
    else {
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: {
          duration: 0.3,
          ease: [0.34, 1.56, 0.64, 1], // Bouncy ease for return
        },
      });
    }
    setSwipeDirection(null);
  };

  return (
    <motion.div
      className={`card-swipeable ${disabled ? 'disabled' : ''}`}
      style={style}
      data-swipe={swipeDirection}
      drag={disabled ? false : true}
      dragConstraints={{ left: -300, right: 300, top: -150, bottom: 150 }}
      dragElastic={0.1}
      dragMomentum={false}
      dragTransition={{
        bounceStiffness: 300,
        bounceDamping: 20,
        power: 0.3,
        timeConstant: 200,
      }}
      onDragStart={() => {}}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileDrag={{
        scale: 1.05,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      }}
    >
      <img src={profile.photoUrl} alt={profile.name} className="card-image" />
      <div className="card-content">
        <h3 className="card-name">
          {profile.name}, {profile.age}
        </h3>
        <p className="card-bio">
          <BioWithFund bio={profile.bio} fund={profile.strikeFund} />
        </p>
      </div>
    </motion.div>
  );
}
