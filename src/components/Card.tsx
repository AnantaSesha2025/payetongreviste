import { useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { BioWithFund } from './BioWithFund'
import type { PanInfo } from 'framer-motion'

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
    strikeFund: { url: string; title: string } 
  }
  /** Callback function triggered when card is swiped left or right */
  onSwipe?: (dir: 'left' | 'right') => void
  /** Callback function triggered when card is swiped up for details */
  onSwipeUp?: () => void
  /** Additional CSS styles to apply to the card */
  style?: React.CSSProperties
  /** Whether the card is disabled (non-draggable) */
  disabled?: boolean
}

/**
 * A swipeable card component that displays a user profile with drag gestures.
 * Supports swipe left (pass), right (like), and up (details) gestures.
 * 
 * @param props - The component props
 * @returns JSX element representing a swipeable profile card
 */
export function Card({ profile, onSwipe, onSwipeUp, style, disabled }: CardProps) {
  const controls = useAnimation()
  const [isDragging, setIsDragging] = useState(false)
  
  // Threshold values for determining swipe direction
  const threshold = 120 // Horizontal swipe threshold
  const upThreshold = 140 // Vertical swipe threshold

  /**
   * Handles the end of a drag gesture and determines the swipe direction
   * @param _ - Unused event parameter
   * @param info - Pan gesture information containing offset data
   */
  const handleDragEnd = (_: any, info: PanInfo) => {
    const x = info.offset.x
    const y = info.offset.y
    
    // Swipe up for details
    if (-y > upThreshold) {
      controls.start({ y: -800, rotate: 0, opacity: 0, transition: { duration: 0.25 } })
      onSwipeUp?.()
    } 
    // Swipe right to like
    else if (x > threshold) {
      controls.start({ x: 800, rotate: 20, opacity: 0, transition: { duration: 0.25 } })
      onSwipe?.('right')
    } 
    // Swipe left to pass
    else if (x < -threshold) {
      controls.start({ x: -800, rotate: -20, opacity: 0, transition: { duration: 0.25 } })
      onSwipe?.('left')
    } 
    // Return to original position if threshold not met
    else {
      controls.start({ x: 0, y: 0, rotate: 0 })
    }
    setIsDragging(false)
  }

  return (
    <motion.div
      className="card"
      style={style}
      drag={disabled ? false : true}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileDrag={{ rotate: (isDragging ? 1 : 0) }}
    >
      <div className="card-contents">
        <img src={profile.photoUrl} alt={profile.name} className="card-media" />
        <div className="card-overlay">
          <h3 className="card-title">{profile.name}, {profile.age}</h3>
          <p className="card-bio">
            <BioWithFund bio={profile.bio} fund={profile.strikeFund as any} />
          </p>
        </div>
      </div>
    </motion.div>
  )
}


