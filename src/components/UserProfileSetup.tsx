import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Camera, Link, Save, ArrowLeft } from 'react-feather'
import { useAppStore, type Profile } from '../store'
import { useToast } from './Toast'
import './UserProfileSetup.css'

/**
 * User profile setup component for creating and editing user profiles
 * Allows users to set up their activist profile with photo, bio, and strike fund
 */
export function UserProfileSetup({ onComplete }: { onComplete: () => void }) {
  const { currentUser, updateUserProfile, upsertProfile } = useAppStore()
  const { showSuccess, showError } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    age: currentUser?.age || 18,
    bio: currentUser?.bio || '',
    photoUrl: currentUser?.photoUrl || '',
    strikeFundTitle: currentUser?.strikeFund?.title || '',
    strikeFundUrl: currentUser?.strikeFund?.url || '',
    location: currentUser?.location || { lat: 0, lon: 0 }
  })

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Age must be between 18 and 100'
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required'
    } else if (formData.bio.trim().length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters'
    }

    if (!formData.photoUrl.trim()) {
      newErrors.photoUrl = 'Photo URL is required'
    } else if (!isValidUrl(formData.photoUrl)) {
      newErrors.photoUrl = 'Please enter a valid URL'
    }

    if (!formData.strikeFundTitle.trim()) {
      newErrors.strikeFundTitle = 'Strike fund title is required'
    }

    if (!formData.strikeFundUrl.trim()) {
      newErrors.strikeFundUrl = 'Strike fund URL is required'
    } else if (!isValidUrl(formData.strikeFundUrl)) {
      newErrors.strikeFundUrl = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Simple URL validation
  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const profile: Profile = {
        id: currentUser?.id || `user_${Date.now()}`,
        name: formData.name.trim(),
        age: formData.age,
        bio: formData.bio.trim(),
        photoUrl: formData.photoUrl.trim(),
        location: formData.location,
        strikeFund: {
          title: formData.strikeFundTitle.trim(),
          url: formData.strikeFundUrl.trim()
        }
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      await upsertProfile(profile)
      updateUserProfile(profile)
      
      showSuccess(
        currentUser ? 'Profile Updated!' : 'Profile Created!',
        'Your activist profile is now live'
      )
      
      onComplete()
    } catch (error) {
      console.error('Error saving profile:', error)
      showError('Save Failed', 'Failed to save profile. Please try again.')
      setErrors({ submit: 'Failed to save profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle photo URL change with preview
  const handlePhotoUrlChange = (url: string) => {
    handleInputChange('photoUrl', url)
  }

  return (
    <motion.div
      className="user-profile-setup"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="profile-setup-container">
        {/* Header */}
        <div className="profile-setup-header">
          <button 
            className="back-btn"
            onClick={onComplete}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1>{currentUser ? 'Edit Profile' : 'Create Your Profile'}</h1>
          <div className="header-spacer" />
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Photo Section */}
          <div className="form-section">
            <label htmlFor="photoUrl" className="form-label">
              <Camera size={20} />
              Profile Photo
            </label>
            <div className="photo-preview-container">
              {formData.photoUrl && (
                <img 
                  src={formData.photoUrl} 
                  alt="Profile preview" 
                  className="photo-preview"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              <div className="photo-placeholder">
                <User size={32} />
                <span>Photo Preview</span>
              </div>
            </div>
            <input
              id="photoUrl"
              type="url"
              value={formData.photoUrl}
              onChange={(e) => handlePhotoUrlChange(e.target.value)}
              placeholder="Enter photo URL"
              className={`form-input ${errors.photoUrl ? 'error' : ''}`}
            />
            {errors.photoUrl && <span className="error-message">{errors.photoUrl}</span>}
          </div>

          {/* Basic Info */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <User size={20} />
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your name"
                className={`form-input ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="age" className="form-label">
                <User size={20} />
                Age
              </label>
              <input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 18)}
                min="18"
                max="100"
                className={`form-input ${errors.age ? 'error' : ''}`}
              />
              {errors.age && <span className="error-message">{errors.age}</span>}
            </div>
          </div>

          {/* Bio */}
          <div className="form-section">
            <label htmlFor="bio" className="form-label">
              <User size={20} />
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about your activism and causes you support..."
              rows={4}
              className={`form-textarea ${errors.bio ? 'error' : ''}`}
            />
            {errors.bio && <span className="error-message">{errors.bio}</span>}
            <div className="char-count">{formData.bio.length}/500</div>
          </div>

          {/* Strike Fund */}
          <div className="form-section">
            <h3 className="section-title">Strike Fund Information</h3>
            <p className="section-description">
              Share your strike fund so others can support your cause
            </p>

            <div className="form-group">
              <label htmlFor="strikeFundTitle" className="form-label">
                <Link size={20} />
                Fund Title
              </label>
              <input
                id="strikeFundTitle"
                type="text"
                value={formData.strikeFundTitle}
                onChange={(e) => handleInputChange('strikeFundTitle', e.target.value)}
                placeholder="e.g., Support the Climate Strike"
                className={`form-input ${errors.strikeFundTitle ? 'error' : ''}`}
              />
              {errors.strikeFundTitle && <span className="error-message">{errors.strikeFundTitle}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="strikeFundUrl" className="form-label">
                <Link size={20} />
                Fund URL
              </label>
              <input
                id="strikeFundUrl"
                type="url"
                value={formData.strikeFundUrl}
                onChange={(e) => handleInputChange('strikeFundUrl', e.target.value)}
                placeholder="https://example.com/strike-fund"
                className={`form-input ${errors.strikeFundUrl ? 'error' : ''}`}
              />
              {errors.strikeFundUrl && <span className="error-message">{errors.strikeFundUrl}</span>}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="submit-error">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              <>
                <Save size={20} />
                {currentUser ? 'Update Profile' : 'Create Profile'}
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  )
}
