import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SwipeDeck } from '../components/SwipeDeck'

/**
 * Main discover page component that displays the swipe interface.
 * Prevents body scrolling to maintain a mobile app-like experience.
 * 
 * @returns JSX element representing the discover page
 */
export default function DiscoverPage() {
  // Prevent body scrolling to maintain mobile app feel
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])
  
  return (
    <div className="discover">
      <div className="discover-header">
        <h1>Discover Activists</h1>
        <Link to="/activist" className="activist-sublink">
          <span>Create Profile</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
      <SwipeDeck />
    </div>
  )
}


