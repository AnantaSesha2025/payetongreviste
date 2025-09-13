import { motion } from 'framer-motion'
import './LoadingSpinner.css'

/**
 * Loading spinner component with customizable size and color
 * Provides visual feedback during async operations
 */
export function LoadingSpinner({ 
  size = 'medium', 
  color = 'primary',
  text = 'Loading...',
  showText = true 
}: {
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'white' | 'black'
  text?: string
  showText?: boolean
}) {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }

  const colorClasses = {
    primary: 'spinner-primary',
    white: 'spinner-white',
    black: 'spinner-black'
  }

  return (
    <div className="loading-spinner-container">
      <motion.div
        data-testid="loading-spinner"
        className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {showText && text && (
        <motion.p
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

/**
 * Full-screen loading overlay component
 * Used for major loading states like app initialization
 */
export function LoadingOverlay({ text = 'Loading...' }: { text?: string }) {
  return (
    <motion.div
      data-testid="loading-overlay"
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoadingSpinner size="large" text={text} />
    </motion.div>
  )
}

/**
 * Inline loading component for buttons and small elements
 * Replaces button content during loading states
 */
export function InlineLoader({ size = 'small' }: { size?: 'small' | 'medium' }) {
  return (
    <div data-testid="inline-loader" className="inline-loader">
      <LoadingSpinner size={size} showText={false} />
    </div>
  )
}
