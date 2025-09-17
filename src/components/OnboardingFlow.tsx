import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, X, ArrowUp, Users, Target } from 'react-feather';
import './OnboardingFlow.css';

/**
 * Onboarding flow component that introduces users to the app
 * Includes welcome screen, gesture tutorial, and feature overview
 */
export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: 'Bienvenue sur PayeTonGréviste',
      subtitle: 'Découvrez des caisses de grève réelles',
      content:
        'Cette app vous aide à découvrir et soutenir des caisses de grève authentiques. Les profils que vous verrez sont fictifs, mais les causes et les fonds de grève sont bien réels !',
      icon: <Users size={48} />,
      color: 'var(--primary-yellow)',
    },
    {
      title: 'Glissez pour Découvrir',
      subtitle: 'Apprenez les gestes',
      content:
        'Glissez vers la droite pour soutenir une cause, vers la gauche pour passer, ou vers le haut pour voir plus de détails sur la caisse de grève de chaque activiste.',
      icon: <Target size={48} />,
      color: '#10b981',
      gestures: true,
    },
    {
      title: 'Soutenez les Caisses de Grève',
      subtitle: 'Faites une vraie différence',
      content:
        'Chaque profil fictif est lié à une vraie caisse de grève que vous pouvez soutenir. Vos contributions vont directement aux travailleurs en lutte.',
      icon: <Heart size={48} />,
      color: '#ef4444',
    },
    {
      title: 'Profils Fictifs, Causes Réelles',
      subtitle: "Comprendre l'app",
      content:
        "Les profils d'activistes sont créés pour rendre la découverte des caisses de grève plus engageante. Chaque profil représente une vraie cause et vous redirige vers un vrai fonds de grève.",
      icon: <Users size={48} />,
      color: 'var(--primary-yellow)',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  if (!isVisible) return null;

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
            <div
              className="step-icon"
              style={{ color: steps[currentStep].color }}
            >
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
                        <span>Soutenir</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Action buttons */}
          <div className="onboarding-actions">
            <button className="skip-btn" onClick={handleSkip}>
              Passer
            </button>
            <button className="next-btn" onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
