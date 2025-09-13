import { Users, RefreshCw, Plus } from 'react-feather'
import { motion } from 'framer-motion'
import './EnhancedEmptyState.css'

/**
 * Enhanced empty state component for when no more profiles are available
 * Provides engaging content and clear call-to-action
 */
export function EnhancedEmptyState({ 
  onCreateProfile, 
  onRefresh 
}: { 
  onCreateProfile: () => void
  onRefresh: () => void 
}) {
  return (
    <motion.div
      className="enhanced-empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="empty-state-content">
        <motion.div
          className="empty-state-icon"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Users size={64} />
        </motion.div>
        
        <h2 className="empty-state-title">
          No more activists to discover right now
        </h2>
        
        <p className="empty-state-description">
          You've seen all available profiles! Check back later for new activists joining the movement, or create your own profile to connect with others.
        </p>
        
        <div className="empty-state-actions">
          <button 
            className="action-btn primary"
            onClick={onCreateProfile}
          >
            <Plus size={20} />
            Create Your Profile
          </button>
          
          <button 
            className="action-btn secondary"
            onClick={onRefresh}
          >
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>
        
        <div className="empty-state-tips">
          <h3>What's next?</h3>
          <ul>
            <li>Create your activist profile to join the community</li>
            <li>Check your matches to start conversations</li>
            <li>Share the app to bring more activists on board</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
