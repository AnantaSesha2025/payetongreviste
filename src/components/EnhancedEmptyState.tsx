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
          Plus d'activistes à découvrir pour le moment
        </h2>
        
        <p className="empty-state-description">
          Vous avez vu tous les profils disponibles ! Revenez plus tard pour de nouveaux activistes rejoignant le mouvement, ou créez votre propre profil pour vous connecter avec d'autres.
        </p>
        
        <div className="empty-state-actions">
          <button 
            className="action-btn primary"
            onClick={onCreateProfile}
          >
            <Plus size={20} />
            Créer Votre Profil
          </button>
          
          <button 
            className="action-btn secondary"
            onClick={onRefresh}
          >
            <RefreshCw size={20} />
            Actualiser
          </button>
        </div>
        
        <div className="empty-state-tips">
          <h3>Et maintenant ?</h3>
          <ul>
            <li>Créez votre profil d'activiste pour rejoindre la communauté</li>
            <li>Consultez vos correspondances pour commencer des conversations</li>
            <li>Partagez l'application pour amener plus d'activistes à bord</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
