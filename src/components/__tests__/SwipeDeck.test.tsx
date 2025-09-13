import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SwipeDeck } from '../SwipeDeck'
import { useAppStore } from '../../store'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useAnimation: () => ({
    start: vi.fn(),
  }),
}))

// Mock the store
vi.mock('../../store', () => ({
  useAppStore: vi.fn(),
  mockProfiles: [
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
}))

const mockStore = {
  profiles: [],
  likedIds: new Set(),
  passedIds: new Set(),
  setProfiles: vi.fn(),
  likeProfile: vi.fn(),
  passProfile: vi.fn(),
}

describe('SwipeDeck Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAppStore).mockReturnValue(mockStore)
  })

  it('renders empty state when no profiles', () => {
    render(<SwipeDeck />)
    
    expect(screen.getByText("You're all caught up")).toBeInTheDocument()
  })

  it('renders current profile when available', () => {
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
      profiles
    })
    
    render(<SwipeDeck />)
    
    expect(screen.getByText('Test User, 25')).toBeInTheDocument()
    expect(screen.getByText('Test bio')).toBeInTheDocument()
  })

  it('renders next profile as preview', () => {
    const profiles = [
      {
        id: '1',
        name: 'Current User',
        age: 25,
        bio: 'Current bio',
        photoUrl: 'https://example.com/current.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/current-fund', title: 'Current Fund' }
      },
      {
        id: '2',
        name: 'Next User',
        age: 30,
        bio: 'Next bio',
        photoUrl: 'https://example.com/next.jpg',
        location: { lat: 48.8666, lon: 2.3333 },
        strikeFund: { url: 'https://example.com/next-fund', title: 'Next Fund' }
      }
    ]
    
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles
    })
    
    render(<SwipeDeck />)
    
    // Should render both current and next profiles
    expect(screen.getByText('Current User, 25')).toBeInTheDocument()
    expect(screen.getByText('Next User, 30')).toBeInTheDocument()
  })

  it('calls likeProfile when like button is clicked', () => {
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
    
    const likeProfile = vi.fn()
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles,
      likeProfile
    })
    
    render(<SwipeDeck />)
    
    const likeButton = screen.getByLabelText('Like')
    fireEvent.click(likeButton)
    
    expect(likeProfile).toHaveBeenCalledWith('1')
  })

  it('calls passProfile when pass button is clicked', () => {
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
    
    const passProfile = vi.fn()
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles,
      passProfile
    })
    
    render(<SwipeDeck />)
    
    const passButton = screen.getByLabelText('Pass')
    fireEvent.click(passButton)
    
    expect(passProfile).toHaveBeenCalledWith('1')
  })

  it('opens details modal when details button is clicked', () => {
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
      profiles
    })
    
    render(<SwipeDeck />)
    
    const detailsButton = screen.getByLabelText('Details')
    fireEvent.click(detailsButton)
    
    // Modal should appear with profile details
    expect(screen.getByText('Test User, 25')).toBeInTheDocument()
    expect(screen.getByText('Test bio')).toBeInTheDocument()
    expect(screen.getByText('Test Fund')).toBeInTheDocument()
  })

  it('closes details modal when close button is clicked', () => {
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
      profiles
    })
    
    render(<SwipeDeck />)
    
    // Open modal
    const detailsButton = screen.getByLabelText('Details')
    fireEvent.click(detailsButton)
    
    // Close modal
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)
    
    // Modal should be closed
    expect(screen.queryByText('Close')).not.toBeInTheDocument()
  })

  it('closes details modal when backdrop is clicked', () => {
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
      profiles
    })
    
    render(<SwipeDeck />)
    
    // Open modal
    const detailsButton = screen.getByLabelText('Details')
    fireEvent.click(detailsButton)
    
    // Click backdrop
    const backdrop = screen.getByText('Test User, 25').closest('.modal-backdrop')
    fireEvent.click(backdrop!)
    
    // Modal should be closed
    expect(screen.queryByText('Close')).not.toBeInTheDocument()
  })
})
