import { useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { BioWithFund } from './BioWithFund'
import type { PanInfo } from 'framer-motion'

export type CardProps = {
  profile: { id: string; name: string; age: number; bio: string; photoUrl: string; strikeFund: { url: string; title: string } }
  onSwipe?: (dir: 'left' | 'right') => void
  onSwipeUp?: () => void
  style?: React.CSSProperties
  disabled?: boolean
}

export function Card({ profile, onSwipe, onSwipeUp, style, disabled }: CardProps) {
  const controls = useAnimation()
  const [isDragging, setIsDragging] = useState(false)
  const threshold = 120
  const upThreshold = 140

  const handleDragEnd = (_: any, info: PanInfo) => {
    const x = info.offset.x
    const y = info.offset.y
    if (-y > upThreshold) {
      controls.start({ y: -800, rotate: 0, opacity: 0, transition: { duration: 0.25 } })
      onSwipeUp?.()
    } else if (x > threshold) {
      controls.start({ x: 800, rotate: 20, opacity: 0, transition: { duration: 0.25 } })
      onSwipe?.('right')
    } else if (x < -threshold) {
      controls.start({ x: -800, rotate: -20, opacity: 0, transition: { duration: 0.25 } })
      onSwipe?.('left')
    } else {
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
          <p className="card-bio"><BioWithFund bio={profile.bio} fund={profile.strikeFund as any} /></p>
        </div>
      </div>
    </motion.div>
  )
}


