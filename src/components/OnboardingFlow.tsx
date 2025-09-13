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
      title: "Welcome to PayeTonGreviste",
      subtitle: "Connect with activists fighting for change",
      content: "Discover like-minded activists, support their causes, and build meaningful connections in the fight for social justice.",
      icon: <Users size={48} />,
      color: "var(--primary-yellow)"
    },
    {
      title: "Swipe to Connect",
      subtitle: "Learn the gestures",
      content: "Swipe right to like, left to pass, or up to see more details about each activist's cause.",
      icon: <Target size={48} />,
      color: "#10b981",
      gestures: true
    },
    {
      title: "Support Causes",
      subtitle: "Make a real impact",
      content: "Each activist has a strike fund you can support. Every contribution helps advance their cause.",
      icon: <Heart size={48} />,
      color: "#ef4444"
    },
    {
      title: "Create Your Profile",
      subtitle: "Join the movement",
      content: "Set up your own activist profile to connect with others and share your own strike fund.",
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
                        <span>Details</span>
                      </div>
                      <div className="arrow-left">
                        <X size={24} />
                        <span>Pass</span>
                      </div>
                      <div className="arrow-right">
                        <Heart size={24} />
                        <span>Like</span>
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
              Skip
            </button>
            <button 
              className="next-btn"
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
