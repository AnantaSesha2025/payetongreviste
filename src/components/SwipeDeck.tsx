import { useEffect, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { Card } from './Card'
// import { BioWithFund } from './BioWithFund'
import { Heart, Plus, X, ArrowDown } from 'react-feather'
import { mockProfiles, useAppStore } from '../store'
// import { haversineKm } from '../lib/geo'

/**
 * Main swipe deck component that manages the card stack and user interactions.
 * Displays profiles in a stack with the current card on top and next card previewed behind.
 * Handles swipe gestures and provides action buttons for pass, like, and details.
 * 
 * @returns JSX element representing the swipe deck interface
 */
export function SwipeDeck() {
  const { profiles, setProfiles, likeProfile, passProfile } = useAppStore()
  const [index, setIndex] = useState(0)

  // Initialize profiles with mock data if none exist
  useEffect(() => {
    if (profiles.length === 0) setProfiles(mockProfiles)
  }, [profiles.length, setProfiles])

  // Get current and next profile for the card stack
  // Geolocation temporarily disabled due to bugs; show all profiles
  const current = profiles[index]
  const next = profiles[index + 1]

  /**
   * Handles user choice when swiping or clicking action buttons
   * @param dir - Direction of the swipe ('left' for pass, 'right' for like)
   */
  const handleChoice = (dir: 'left' | 'right') => {
    if (!current) return
    if (dir === 'right') likeProfile(current.id)
    else passProfile(current.id)
    setIndex((v) => v + 1)
  }

  // State for managing details modal visibility
  const [showDetails, setShowDetails] = useState(false)
  const openDetails = () => setShowDetails(true)
  const closeDetails = () => setShowDetails(false)

  return (
    <div className="deck">
      {next && <Card profile={next} style={{ transform: 'scale(0.98)', opacity: 0.9 } as any} disabled />}
      {current ? (
        <Card key={current.id} profile={current} onSwipe={handleChoice} onSwipeUp={openDetails} />
      ) : (
        <div className="empty-state"><p>You're all caught up</p></div>
      )}
      <ActionBar onPass={() => handleChoice('left')} onLike={() => handleChoice('right')} onDetails={openDetails} />
      <AnimatePresence>
        {showDetails && current && (
          <DetailsModal 
            key="details-modal"
            onClose={closeDetails} 
            name={current.name} 
            age={current.age} 
            bio={current.bio} 
            strikeUrl={current.strikeFund.url} 
            strikeTitle={current.strikeFund.title} 
            photoUrl={current.photoUrl} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Action bar component with buttons for pass, details, and like actions
 * @param props - Component props
 * @param props.onPass - Callback for pass action
 * @param props.onLike - Callback for like action  
 * @param props.onDetails - Callback for details action
 * @returns JSX element representing the action bar
 */
function ActionBar({ onPass, onLike, onDetails }: { onPass: () => void; onLike: () => void; onDetails: () => void }) {
  return (
    <div className="action-bar">
      <button aria-label="Pass" onClick={onPass} className="action-btn action-btn--pass"><X /></button>
      <button aria-label="Details" onClick={onDetails} className="action-btn action-btn--details"><Plus /></button>
      <button aria-label="Like" onClick={onLike} className="action-btn action-btn--like"><Heart /></button>
    </div>
  )
}

/**
 * Full-screen profile details component with swipe-down to close functionality
 * @param props - Component props
 * @param props.onClose - Callback to close the modal
 * @param props.name - Profile name
 * @param props.age - Profile age
 * @param props.bio - Profile bio text
 * @param props.strikeUrl - URL to the strike fund
 * @param props.strikeTitle - Title of the strike fund
 * @param props.photoUrl - URL to the profile photo
 * @returns JSX element representing the full-screen details view
 */
function DetailsModal({ onClose, name, age, bio, strikeUrl, strikeTitle, photoUrl }: { 
  onClose: () => void; 
  name: string; 
  age: number; 
  bio: string; 
  strikeUrl: string; 
  strikeTitle: string; 
  photoUrl: string 
}) {
  const controls = useAnimation()
  const swipeDownThreshold = 100

  /**
   * Handles the end of a drag gesture for swipe-down to close
   * @param _ - Unused event parameter
   * @param info - Pan gesture information containing offset data
   */
  const handleDragEnd = (_: any, info: PanInfo) => {
    const y = info.offset.y
    
    // Swipe down to close
    if (y > swipeDownThreshold) {
      controls.start({ 
        y: window.innerHeight, 
        opacity: 0, 
        transition: { duration: 0.3, ease: "easeInOut" } 
      }).then(() => {
        onClose()
      })
    } else {
      // Return to original position
      controls.start({ y: 0, opacity: 1 })
    }
  }

  return (
    <motion.div 
      className="details-fullscreen"
      initial={{ y: window.innerHeight, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: window.innerHeight, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.2 }}
      onDragEnd={handleDragEnd}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: '#121214',
        overflow: 'hidden'
      }}
    >
      {/* Swipe indicator */}
      <div className="swipe-indicator">
        <ArrowDown size={24} />
        <span>Swipe down to go back</span>
      </div>

      {/* Profile image */}
      <div className="details-image-container">
        <img src={photoUrl} alt={name} className="details-image" />
      </div>

      {/* Profile content */}
      <div className="details-content">
        <div className="details-header">
          <h1 className="details-title">{name}, {age}</h1>
          <button 
            onClick={onClose} 
            className="details-close-btn"
            aria-label="Close details"
          >
            <X size={24} />
          </button>
        </div>

        <div className="details-body">
          <p className="details-bio">{bio}</p>
          
          <div className="details-strike-fund">
            <h3>Support the Cause</h3>
            <a 
              href={strikeUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="strike-fund-link"
            >
              {strikeTitle}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}


