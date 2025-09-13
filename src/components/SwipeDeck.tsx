import { useEffect, useState } from 'react'
import { Card } from './Card'
// import { BioWithFund } from './BioWithFund'
import { Heart, Plus, X } from 'react-feather'
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
      {showDetails && current && <DetailsModal onClose={closeDetails} name={current.name} age={current.age} bio={current.bio} strikeUrl={current.strikeFund.url} strikeTitle={current.strikeFund.title} photoUrl={current.photoUrl} />}
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
 * Modal component that displays detailed profile information
 * @param props - Component props
 * @param props.onClose - Callback to close the modal
 * @param props.name - Profile name
 * @param props.age - Profile age
 * @param props.bio - Profile bio text
 * @param props.strikeUrl - URL to the strike fund
 * @param props.strikeTitle - Title of the strike fund
 * @param props.photoUrl - URL to the profile photo
 * @returns JSX element representing the details modal
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
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <img src={photoUrl} alt={name} className="modal-media" />
        <div className="modal-body">
          <div className="modal-title">{name}, {age}</div>
          <p className="card-bio">{bio}</p>
          <a href={strikeUrl} target="_blank" rel="noreferrer" className="link-blue">{strikeTitle}</a>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}


