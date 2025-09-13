import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MatchesPage from '../MatchesPage'
import { useAppStore } from '../../store'

// Mock the store
vi.mock('../../store', () => ({
  useAppStore: vi.fn(),
}))

const mockStore = {
  likedIds: new Set(),
  profiles: [],
  chats: {},
  ensureChatFor: vi.fn(),
  addUserMessage: vi.fn(),
}

describe('MatchesPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAppStore).mockReturnValue(mockStore)
  })

  it('renders no matches message when no liked profiles', () => {
    render(<MatchesPage />)
    
    expect(screen.getByText('No matches yet')).toBeInTheDocument()
  })

  it('renders liked profiles in sidebar', () => {
    const profiles = [
      {
        id: '1',
        name: 'Test User 1',
        age: 25,
        bio: 'Test bio 1',
        photoUrl: 'https://example.com/photo1.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund1', title: 'Fund 1' }
      },
      {
        id: '2',
        name: 'Test User 2',
        age: 30,
        bio: 'Test bio 2',
        photoUrl: 'https://example.com/photo2.jpg',
        location: { lat: 48.8666, lon: 2.3333 },
        strikeFund: { url: 'https://example.com/fund2', title: 'Fund 2' }
      }
    ]
    
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      likedIds: new Set(['1', '2']),
      profiles
    })
    
    render(<MatchesPage />)
    
    expect(screen.getByText('Test User 1')).toBeInTheDocument()
    expect(screen.getByText('Test User 2')).toBeInTheDocument()
    expect(screen.getByAltText('Test User 1')).toBeInTheDocument()
    expect(screen.getByAltText('Test User 2')).toBeInTheDocument()
  })

  it('shows chat window when profile is selected', () => {
    const profiles = [
      {
        id: '1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' }
      }
    ]
    
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      likedIds: new Set(['1']),
      profiles
    })
    
    render(<MatchesPage />)
    
    // Click on the first profile in the sidebar
    const profileItems = screen.getAllByText('Test User')
    const sidebarProfile = profileItems.find(el => el.closest('.match-item'))
    fireEvent.click(sidebarProfile!)
    
    // Should show chat window
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('Test Fund')).toBeInTheDocument()
  })

  it('allows sending messages in chat', () => {
    const profiles = [
      {
        id: '1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' }
      }
    ]
    
    const addUserMessage = vi.fn()
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      likedIds: new Set(['1']),
      profiles,
      addUserMessage
    })
    
    render(<MatchesPage />)
    
    // Click on profile to open chat
    const profileItems = screen.getAllByText('Test User')
    const sidebarProfile = profileItems.find(el => el.closest('.match-item'))
    fireEvent.click(sidebarProfile!)
    
    // Type message and send
    const input = screen.getByPlaceholderText('Type a message')
    fireEvent.change(input, { target: { value: 'Hello!' } })
    
    const sendButton = screen.getByText('Send')
    fireEvent.click(sendButton)
    
    expect(addUserMessage).toHaveBeenCalledWith('1', 'Hello!')
  })

  it('displays existing chat messages', () => {
    const profiles = [
      {
        id: '1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Test Fund' }
      }
    ]
    
    const chats = {
      '1': [
        { from: 'bot' as const, text: 'Hello!', ts: Date.now() },
        { from: 'user' as const, text: 'Hi there!', ts: Date.now() }
      ]
    }
    
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      likedIds: new Set(['1']),
      profiles,
      chats
    })
    
    render(<MatchesPage />)
    
    // Click on profile to open chat
    const profileItems = screen.getAllByText('Test User')
    const sidebarProfile = profileItems.find(el => el.closest('.match-item'))
    fireEvent.click(sidebarProfile!)
    
    // Should display existing messages
    expect(screen.getByText('Hello!')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })
})
