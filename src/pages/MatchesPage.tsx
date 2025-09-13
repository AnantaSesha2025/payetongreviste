import { useState } from 'react'
import { useAppStore } from '../store'

/**
 * Matches page component that displays liked profiles and chat interface.
 * Shows a list of liked profiles on the left and chat window on the right.
 * 
 * @returns JSX element representing the matches page
 */
export default function MatchesPage() {
  const { likedIds, profiles } = useAppStore()
  const liked = profiles.filter(p => likedIds.has(p.id))
  const [activeId, setActiveId] = useState<string | null>(liked[0]?.id ?? null)
  
  return (
    <div className="matches-layout" style={{ padding: 0 }}>
      <aside className="matches-aside">
        <ul className="matches-list">
          {liked.map(p => (
            <li key={p.id} className={`match-item ${activeId===p.id ? 'match-item--active' : ''}`} onClick={() => setActiveId(p.id)}>
              <img src={p.photoUrl} alt={p.name} className="match-avatar" />
              <div className="match-name">{p.name}</div>
            </li>
          ))}
        </ul>
      </aside>
      <section className="matches-section" style={{ padding: 0 }}>
        {activeId ? <ChatWindow matchId={activeId} /> : <p>No matches yet</p>}
      </section>
    </div>
  )
}

/**
 * Chat window component for messaging with a matched profile
 * @param props - Component props
 * @param props.matchId - ID of the matched profile to chat with
 * @returns JSX element representing the chat interface
 */
function ChatWindow({ matchId }: { matchId: string }) {
  const { profiles, chats, ensureChatFor, addUserMessage } = useAppStore()
  const profile = profiles.find(p => p.id === matchId)!
  const messages = chats[matchId] ?? []
  const [text, setText] = useState('')
  
  // Ensure chat exists for this match
  useState(() => { ensureChatFor(matchId); return undefined })
  
  /**
   * Sends a message to the chat
   */
  const send = () => {
    if (!text.trim()) return
    addUserMessage(matchId, text.trim())
    setText('')
  }
  
  return (
    <div className="chat">
      <div className="chat-header">
        <div className="chat-title">{profile.name}</div>
        <a href={profile.strikeFund.url} target="_blank" rel="noreferrer" className="link-blue">{profile.strikeFund.title}</a>
      </div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.from==='user' ? 'bubble--user' : 'bubble--bot'}`}>{m.text}</div>
        ))}
      </div>
      <div className="chat-input">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" className="input" />
        <button onClick={send}>Send</button>
      </div>
    </div>
  )
}


