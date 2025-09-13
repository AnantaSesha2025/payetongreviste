import { useMemo, useState } from 'react'
import type { Profile } from '../store'
import { useAppStore } from '../store'

/**
 * Activist setup page component for creating and managing fake activist profiles.
 * Allows activists to create profiles with AI generation, edit existing profiles,
 * and preview how they will appear in the swipe interface.
 * 
 * @returns JSX element representing the activist setup page
 */
export default function ActivistSetupPage() {
  const { profiles, upsertProfile, removeProfile } = useAppStore()
  const [editingId, setEditingId] = useState<string | null>(profiles[0]?.id ?? null)
  const current = useMemo(() => profiles.find(p => p.id === editingId) ?? emptyProfile(), [profiles, editingId])
  const [draft, setDraft] = useState<Profile>(current)

  // Helper functions for updating draft profile
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => setDraft({ ...draft, [key]: value })
  const setLoc = (key: 'lat' | 'lon', value: number) => setDraft({ ...draft, location: { ...draft.location, [key]: value } })
  const setFund = <K extends keyof Profile['strikeFund']>(key: K, value: Profile['strikeFund'][K]) => setDraft({ ...draft, strikeFund: { ...draft.strikeFund, [key]: value } })

  /**
   * Saves the current draft profile to the store
   */
  const save = () => {
    const toSave = { ...draft, id: draft.id || crypto.randomUUID() }
    upsertProfile(toSave)
    setEditingId(toSave.id)
  }

  /**
   * Deletes the currently editing profile
   */
  const del = () => {
    if (!editingId) return
    removeProfile(editingId)
    setEditingId(null)
    setDraft(emptyProfile())
  }

  /**
   * Generates AI content for the profile (currently using mock data)
   * In production, this would call an AI API to generate realistic profile content
   */
  const generateAI = () => {
    // Placeholder: In production, call your API to generate profile fields
    const ideas = aiMock()
    setDraft({
      ...draft,
      name: ideas.name,
      age: ideas.age,
      bio: ideas.bio,
      photoUrl: ideas.photoUrl,
    })
  }

  return (
    <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
      <aside>
        <h2>Activist Setup</h2>
        <button onClick={() => { setEditingId(null); setDraft(emptyProfile()) }}>New profile</button>
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8, marginTop: 12 }}>
          {profiles.map(p => (
            <li key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: editingId===p.id? '#111827':'transparent', borderRadius: 8, padding: 6 }} onClick={() => { setEditingId(p.id); setDraft(p) }}>
              <img src={p.photoUrl} alt={p.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 8 }} />
              <div>{p.name}</div>
            </li>
          ))}
        </ul>
      </aside>
      <section>
        <div style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Name</label>
            <input value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="Name" />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Age</label>
            <input type="number" value={draft.age} onChange={(e) => set('age', Number(e.target.value))} />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Bio</label>
            <textarea rows={4} value={draft.bio} onChange={(e) => set('bio', e.target.value)} />
            <div style={{ color: '#9ca3af', fontSize: 12 }}>
              The last word of the bio will be rendered as a link to the strike fund.
            </div>
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Photo URL</label>
            <input value={draft.photoUrl} onChange={(e) => set('photoUrl', e.target.value)} placeholder="https://..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Lat</label>
              <input type="number" value={draft.location.lat} onChange={(e) => setLoc('lat', Number(e.target.value))} />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Lon</label>
              <input type="number" value={draft.location.lon} onChange={(e) => setLoc('lon', Number(e.target.value))} />
            </div>
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Strike fund title</label>
            <input value={draft.strikeFund.title} onChange={(e) => setFund('title', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label>Strike fund URL</label>
            <input value={draft.strikeFund.url} onChange={(e) => setFund('url', e.target.value)} placeholder="https://fund.example" />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save}>Save</button>
            <button onClick={generateAI}>Generate with AI (placeholder)</button>
            <button onClick={del} disabled={!editingId}>Delete</button>
          </div>

          <div style={{ marginTop: 12, border: '1px solid #1f2937', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: 8, borderBottom: '1px solid #1f2937', fontWeight: 600 }}>Preview</div>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, padding: 12, alignItems: 'center' }}>
              <img src={draft.photoUrl} alt={draft.name} style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 12 }} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{draft.name}, {draft.age}</div>
                <div style={{ color: '#9ca3af', marginTop: 6 }}>{draft.bio}</div>
                <div style={{ marginTop: 8 }}>
                  <a href={draft.strikeFund.url} target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>{draft.strikeFund.title}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * Creates an empty profile template for new profiles
 * @returns Empty profile object with default values
 */
function emptyProfile(): Profile {
  return {
    id: '',
    name: '',
    age: 25,
    bio: '',
    photoUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=800&q=80&auto=format&fit=crop',
    location: { lat: 48.8566, lon: 2.3522 },
    strikeFund: { title: '', url: '' },
  }
}

/**
 * Generates mock AI content for profile generation
 * In production, this would be replaced with actual AI API calls
 * @returns Object containing generated profile data
 */
function aiMock() {
  const names = ['Jordan', 'Casey', 'Morgan', 'Reese', 'Avery']
  const bios = [
    'Community organizer and weekend climber.',
    'Healthcare advocate who loves cooking and jazz.',
    'Transit nerd, coffee powered, always learning.',
    'Teacher, reader, and city cyclist.',
  ]
  const pics = [
    'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=800&q=80&auto=format&fit=crop',
  ]
  return {
    name: names[Math.floor(Math.random() * names.length)],
    age: 22 + Math.floor(Math.random() * 12),
    bio: bios[Math.floor(Math.random() * bios.length)],
    photoUrl: pics[Math.floor(Math.random() * pics.length)],
  }
}


