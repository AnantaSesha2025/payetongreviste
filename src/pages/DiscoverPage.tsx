import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SwipeDeck } from '../components/SwipeDeck'
import { OnboardingFlow } from '../components/OnboardingFlow'
import './DiscoverPage.css'

/**
 * Main discover page component that displays the swipe interface.
 * Prevents body scrolling to maintain a mobile app-like experience.
 * 
 * @returns JSX element representing the discover page
 */
export default function DiscoverPage() {
  const navigate = useNavigate()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(
    localStorage.getItem('hasSeenOnboarding') === 'true'
  )

  // Prevent body scrolling to maintain mobile app feel
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Show onboarding for first-time users
  useEffect(() => {
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [hasSeenOnboarding])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    setHasSeenOnboarding(true)
    localStorage.setItem('hasSeenOnboarding', 'true')
  }

  const handleCreateProfile = () => {
    navigate('/activist')
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }
  
  return (
    <div className="discover">
      <div className="discover-header">
        <h1>Découvrir les Activistes</h1>
        {/* Create Profile button hidden as requested */}
        {/* <button 
          className="create-profile-btn"
          onClick={handleCreateProfile}
          aria-label="Create your profile"
        >
          <Plus size={20} />
          <span>Create Profile</span>
        </button> */}
      </div>
      <SwipeDeck onCreateProfile={handleCreateProfile} />
    </div>
  )
}


