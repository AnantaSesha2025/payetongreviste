import { useState } from 'react'

/**
 * Profile page component for editing user profile information.
 * Currently a placeholder implementation with basic name and bio fields.
 * 
 * @returns JSX element representing the profile page
 */
export default function ProfilePage() {
  const [name, setName] = useState('You')
  const [bio, setBio] = useState('Hello there!')
  const [saved, setSaved] = useState(false)
  
  /**
   * Handles form submission and shows save confirmation
   * @param e - Form submit event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }
  
  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Your name" />
        </label>
        <label className="field">
          <span>Bio</span>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio" rows={3} />
        </label>
        <button type="submit">Save</button>
        {saved && <span style={{ color: '#34d399' }}>Saved!</span>}
      </form>
    </div>
  )
}


