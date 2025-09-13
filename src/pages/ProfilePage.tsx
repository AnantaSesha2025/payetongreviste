import { useState } from 'react'

export default function ProfilePage() {
  const [name, setName] = useState('You')
  const [bio, setBio] = useState('Hello there!')
  const [saved, setSaved] = useState(false)
  return (
    <div>
      <form className="form" onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 1200) }}>
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


