import { useEffect } from 'react'
import { SwipeDeck } from '../components/SwipeDeck'

export default function DiscoverPage() {
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


