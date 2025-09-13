import { useState } from 'react'
import { useAppStore } from '../store'
import './MatchesPage.css'

/**
 * Matches page component that displays liked profiles and chat interface.
 * Shows a list of liked profiles on the left and chat window on the right.
 * 
 * @returns JSX element representing the matches page
 */
export default function MatchesPage() {
  const { likedIds, profiles, currentUser } = useAppStore()
  const liked = profiles.filter(p => likedIds.has(p.id))
  // Add current user profile at the beginning of the list
  const allMatches = currentUser ? [currentUser, ...liked] : liked
  const [activeId, setActiveId] = useState<string | null>(allMatches[0]?.id ?? null)
  
  return (
    <div className="matches-layout" style={{ padding: 0 }}>
      <aside className="matches-aside">
        <ul className="matches-list">
          {allMatches.map(p => (
            <li 
              key={p.id} 
              className={`match-item ${activeId===p.id ? 'match-item--active' : ''} ${p.id === currentUser?.id ? 'match-item--own' : ''}`} 
              onClick={() => setActiveId(p.id)}
            >
              <img src={p.photoUrl} alt={p.name} className="match-avatar" />
              <div className="match-name">
                {p.name}
                {p.id === currentUser?.id && <span className="own-badge">You</span>}
              </div>
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

  /**
   * Renders message text with clickable links
   * @param text - Message text that may contain URLs
   * @returns JSX element with clickable links
   */
  const renderMessageText = (text: string) => {
    // Simple URL detection regex
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noreferrer" 
            className="link-blue"
            style={{ wordBreak: 'break-all' }}
          >
            {part}
          </a>
        )
      }
      return part
    })
  }
  
  return (
    <div className="modern-chat">
      {/* Modern Chat Header */}
      <div className="chat-header-modern">
        <div className="chat-profile-info">
          <div className="chat-avatar">
            <img src={profile.photoUrl} alt={profile.name} />
          </div>
          <div className="chat-profile-details">
            <h3 className="chat-name">{profile.name}</h3>
            <p className="chat-status">Online</p>
          </div>
        </div>
        <div className="chat-actions">
          <a 
            href={profile.strikeFund.url} 
            target="_blank" 
            rel="noreferrer" 
            className="strike-fund-btn"
          >
            <span>Support</span>
            <span className="fund-title">{profile.strikeFund.title}</span>
          </a>
        </div>
      </div>

      {/* Modern Chat Messages */}
      <div className="chat-messages-modern">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.from === 'user' ? 'message--user' : 'message--bot'}`}>
            {m.from === 'bot' && (
              <div className="message-avatar">
                <img src={profile.photoUrl} alt={profile.name} />
              </div>
            )}
            <div className="message-content">
              <div className={`message-bubble ${m.from === 'user' ? 'message-bubble--user' : 'message-bubble--bot'}`}>
                <div className="message-text">
                  {renderMessageText(m.text)}
                </div>
                <div className="message-time">
                  {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Chat Input */}
      <div className="chat-input-modern">
        <div className="input-container">
          <input 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Type a message..." 
            className="message-input"
            onKeyPress={(e) => e.key === 'Enter' && send()}
          />
          <button 
            onClick={send} 
            className="send-btn"
            disabled={!text.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}


