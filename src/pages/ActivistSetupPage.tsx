import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserProfileSetup } from '../components/UserProfileSetup'

/**
 * Activist setup page component for creating and managing user profiles.
 * Redirects to the new UserProfileSetup component for a better UX.
 * 
 * @returns JSX element representing the activist setup page
 */
export default function ActivistSetupPage() {
  const navigate = useNavigate()
  const [showProfileSetup, setShowProfileSetup] = useState(true)

  const handleProfileComplete = () => {
    setShowProfileSetup(false)
    navigate('/')
  }

  if (showProfileSetup) {
    return <UserProfileSetup onComplete={handleProfileComplete} />
  }

  return null
}