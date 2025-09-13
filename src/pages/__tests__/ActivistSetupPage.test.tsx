import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ActivistSetupPage from '../ActivistSetupPage'
import { useAppStore } from '../../store'

// Mock the store
vi.mock('../../store', () => ({
  useAppStore: vi.fn(),
}))

const mockStore = {
  profiles: [],
  upsertProfile: vi.fn(),
  removeProfile: vi.fn(),
}

describe('ActivistSetupPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAppStore).mockReturnValue(mockStore)
  })

  it('renders activist setup form', () => {
    render(<ActivistSetupPage />)
    
    expect(screen.getByText('Activist Setup')).toBeInTheDocument()
    expect(screen.getByText('New profile')).toBeInTheDocument()
  })

  it('renders form fields for profile creation', () => {
    render(<ActivistSetupPage />)
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Age')).toBeInTheDocument()
    expect(screen.getByLabelText('Bio')).toBeInTheDocument()
    expect(screen.getByLabelText('Photo URL')).toBeInTheDocument()
    expect(screen.getByLabelText('Lat')).toBeInTheDocument()
    expect(screen.getByLabelText('Lon')).toBeInTheDocument()
    expect(screen.getByLabelText('Strike fund title')).toBeInTheDocument()
    expect(screen.getByLabelText('Strike fund URL')).toBeInTheDocument()
  })

  it('allows editing profile fields', () => {
    render(<ActivistSetupPage />)
    
    const nameInput = screen.getByLabelText('Name')
    const ageInput = screen.getByLabelText('Age')
    const bioTextarea = screen.getByLabelText('Bio')
    
    fireEvent.change(nameInput, { target: { value: 'Test Name' } })
    fireEvent.change(ageInput, { target: { value: '30' } })
    fireEvent.change(bioTextarea, { target: { value: 'Test bio' } })
    
    expect(nameInput).toHaveValue('Test Name')
    expect(ageInput).toHaveValue(30)
    expect(bioTextarea).toHaveValue('Test bio')
  })

  it('saves profile when save button is clicked', () => {
    const upsertProfile = vi.fn()
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      upsertProfile
    })
    
    render(<ActivistSetupPage />)
    
    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)
    
    expect(upsertProfile).toHaveBeenCalled()
  })

  it('generates AI content when AI button is clicked', () => {
    render(<ActivistSetupPage />)
    
    const aiButton = screen.getByText('Generate with AI (placeholder)')
    fireEvent.click(aiButton)
    
    // Should populate some fields with generated content
    const nameInput = screen.getByLabelText('Name')
    expect(nameInput).toHaveValue(expect.any(String))
  })

  it('shows existing profiles in sidebar', () => {
    const profiles = [
      {
        id: '1',
        name: 'Existing Profile',
        age: 25,
        bio: 'Existing bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Existing Fund' }
      }
    ]
    
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles
    })
    
    render(<ActivistSetupPage />)
    
    expect(screen.getByText('Existing Profile')).toBeInTheDocument()
    expect(screen.getByAltText('Existing Profile')).toBeInTheDocument()
  })

  it('allows selecting existing profile for editing', () => {
    const profiles = [
      {
        id: '1',
        name: 'Existing Profile',
        age: 25,
        bio: 'Existing bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Existing Fund' }
      }
    ]
    
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles
    })
    
    render(<ActivistSetupPage />)
    
    // Click on existing profile
    const profileItem = screen.getByText('Existing Profile')
    fireEvent.click(profileItem)
    
    // Form should be populated with existing data
    expect(screen.getByDisplayValue('Existing Profile')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing bio')).toBeInTheDocument()
  })

  it('deletes profile when delete button is clicked', () => {
    const profiles = [
      {
        id: '1',
        name: 'Existing Profile',
        age: 25,
        bio: 'Existing bio',
        photoUrl: 'https://example.com/photo.jpg',
        location: { lat: 48.8566, lon: 2.3522 },
        strikeFund: { url: 'https://example.com/fund', title: 'Existing Fund' }
      }
    ]
    
    const removeProfile = vi.fn()
    vi.mocked(useAppStore).mockReturnValue({
      ...mockStore,
      profiles,
      removeProfile
    })
    
    render(<ActivistSetupPage />)
    
    // Select profile first
    const profileItem = screen.getByText('Existing Profile')
    fireEvent.click(profileItem)
    
    // Click delete button
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)
    
    expect(removeProfile).toHaveBeenCalledWith('1')
  })

  it('shows preview of profile', () => {
    render(<ActivistSetupPage />)
    
    // Fill in some data
    const nameInput = screen.getByDisplayValue('')
    const ageInput = screen.getByDisplayValue('25')
    const bioTextarea = screen.getByDisplayValue('')
    
    fireEvent.change(nameInput, { target: { value: 'Preview Name' } })
    fireEvent.change(ageInput, { target: { value: '28' } })
    fireEvent.change(bioTextarea, { target: { value: 'Preview bio' } })
    
    // Should show preview
    expect(screen.getByText('Preview Name, 28')).toBeInTheDocument()
    expect(screen.getByText('Preview bio')).toBeInTheDocument()
  })

  it('shows bio hint about last word becoming link', () => {
    render(<ActivistSetupPage />)
    
    expect(screen.getByText('The last word of the bio will be rendered as a link to the strike fund.')).toBeInTheDocument()
  })
})
