import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Heart, X, ArrowUp, Users, Target } from 'react-feather'
import './OnboardingFlow.css'

/**
 * Onboarding flow component that introduces users to the app
 * Includes welcome screen, gesture tutorial, and feature overview
 */
export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const steps = [
    {
      title: "Bienvenue sur PayeTonGréviste",
      subtitle: "Connectez-vous avec des activistes qui luttent pour le changement",
      content: "Découvrez des activistes partageant vos idées, soutenez leurs causes et créez des liens significatifs dans la lutte pour la justice sociale.",
      icon: <Users size={48} />,
      color: "var(--primary-yellow)"
    },
    {
      title: "Glissez pour vous Connecter",
      subtitle: "Apprenez les gestes",
      content: "Glissez vers la droite pour aimer, vers la gauche pour passer, ou vers le haut pour voir plus de détails sur la cause de chaque activiste.",
      icon: <Target size={48} />,
      color: "#10b981",
      gestures: true
    },
    {
      title: "Soutenir les Causes",
      subtitle: "Faites une vraie différence",
      content: "Chaque activiste a une caisse de grève que vous pouvez soutenir. Chaque contribution aide à faire avancer leur cause.",
      icon: <Heart size={48} />,
      color: "#ef4444"
    },
    {
      title: "Créez Votre Profil",
      subtitle: "Rejoignez le mouvement",
      content: "Configurez votre propre profil d'activiste pour vous connecter avec d'autres et partager votre propre caisse de grève.",
      icon: <Users size={48} />,
      color: "var(--primary-yellow)"
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    setIsVisible(false)
    setTimeout(() => {
      onComplete()
    }, 300)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="onboarding-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="onboarding-container">
          {/* Progress indicator */}
          <div className="progress-indicator">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index <= currentStep ? 'active' : ''}`}
              />
            ))}
          </div>

          {/* Step content */}
          <motion.div
            key={currentStep}
            className="step-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="step-icon" style={{ color: steps[currentStep].color }}>
              {steps[currentStep].icon}
            </div>
            
            <h1 className="step-title">{steps[currentStep].title}</h1>
            <h2 className="step-subtitle">{steps[currentStep].subtitle}</h2>
            <p className="step-description">{steps[currentStep].content}</p>

            {/* Gesture tutorial for step 2 */}
            {steps[currentStep].gestures && (
              <div className="gesture-tutorial">
                <div className="gesture-demo">
                  <div className="gesture-card">
                    <div className="gesture-arrows">
                      <div className="arrow-up">
                        <ArrowUp size={24} />
                        <span>Détails</span>
                      </div>
                      <div className="arrow-left">
                        <X size={24} />
                        <span>Passer</span>
                      </div>
                      <div className="arrow-right">
                        <Heart size={24} />
                        <span>Aimer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Action buttons */}
          <div className="onboarding-actions">
            <button 
              className="skip-btn"
              onClick={handleSkip}
            >
              Passer
            </button>
            <button 
              className="next-btn"
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
