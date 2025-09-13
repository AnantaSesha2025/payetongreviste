import { useEffect } from 'react'
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
      <SwipeDeck />
    </div>
  )
}


