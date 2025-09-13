import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { UserProfileSetup } from '../UserProfileSetup'
import { useAppStore } from '../../store'
import { useToast } from '../Toast'

// Mock the CSS import
vi.mock('../UserProfileSetup.css', () => ({}))

// Mock the store
vi.mock('../../store', () => ({
  useAppStore: vi.fn()
}))

// Mock the toast hook
vi.mock('../Toast', () => ({
  useToast: vi.fn()
}))

const mockUseAppStore = vi.mocked(useAppStore)
const mockUseToast = vi.mocked(useToast)

describe.skip('UserProfileSetup', () => {
  const mockOnComplete = vi.fn()
  const mockUpdateUserProfile = vi.fn()
  const mockUpsertProfile = vi.fn()
  const mockShowSuccess = vi.fn()
  const mockShowError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseAppStore.mockReturnValue({
      currentUser: null,
      updateUserProfile: mockUpdateUserProfile,
      upsertProfile: mockUpsertProfile,
      profiles: [],
      likedIds: new Set(),
      passedIds: new Set(),
      chats: {},
      likeProfile: vi.fn(),
      passProfile: vi.fn(),
      setProfiles: vi.fn(),
      ensureChatFor: vi.fn(),
      addUserMessage: vi.fn(),
      removeProfile: vi.fn(),
      deleteUserProfile: vi.fn(),
      isProfileComplete: vi.fn()
    })

    mockUseToast.mockReturnValue({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showWarning: vi.fn(),
      showInfo: vi.fn()
    })
  })

  it('renders create profile form for new user', () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />)
    
    expect(screen.getByText('Create Your Profile')).toBeInTheDocument()
    expect(screen.getByLabelText('Profile Photo')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Age')).toBeInTheDocument()
    expect(screen.getByLabelText('Bio')).toBeInTheDocument()
  })

  it('renders edit profile form for existing user', () => {
    const existingUser = {
      id: '1',
      name: 'John Doe',
      age: 25,
      bio: 'Test bio',
      photoUrl: 'https://example.com/photo.jpg',
      location: { lat: 0, lon: 0 },
      strikeFund: { title: 'Test Fund', url: 'https://example.com/fund' }
    }

    mockUseAppStore.mockReturnValue({
      currentUser: existingUser,
      updateUserProfile: mockUpdateUserProfile,
      upsertProfile: mockUpsertProfile,
      profiles: [],
      likedIds: new Set(),
      passedIds: new Set(),
      chats: {},
      likeProfile: vi.fn(),
      passProfile: vi.fn(),
      setProfiles: vi.fn(),
      ensureChatFor: vi.fn(),
      addUserMessage: vi.fn(),
      removeProfile: vi.fn(),
      deleteUserProfile: vi.fn(),
      isProfileComplete: vi.fn()
    })

    render(<UserProfileSetup onComplete={mockOnComplete} />)
    
    expect(screen.getByText('Edit Profile')).toBeInTheDocument()
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('25')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />)
    
    const submitButton = screen.getByText('Create Profile')
    fireEvent.click(submitButton)
    
    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Bio is required')).toBeInTheDocument()
      expect(screen.getByText('Photo URL is required')).toBeInTheDocument()
      expect(screen.getByText('Strike fund title is required')).toBeInTheDocument()
      expect(screen.getByText('Strike fund URL is required')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('validates age range', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />)
    
    const ageInput = screen.getByLabelText('Age')
    fireEvent.change(ageInput, { target: { value: '17' } })
    
    const submitButton = screen.getByText('Create Profile')
    fireEvent.click(submitButton)
    
    // Wait for validation error to appear
    await waitFor(() => {
      expect(screen.getByText('Age must be between 18 and 100')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('validates URL format', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />)
    
    const photoInput = screen.getByLabelText('Profile Photo')
    fireEvent.change(photoInput, { target: { value: 'invalid-url' } })
    
    const submitButton = screen.getByText('Create Profile')
    fireEvent.click(submitButton)
    
    // Wait for the error message to appear after state update
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('validates bio minimum length', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />)
    
    const bioInput = screen.getByLabelText('Bio')
    fireEvent.change(bioInput, { target: { value: 'Short' } })
    
    const submitButton = screen.getByText('Create Profile')
    fireEvent.click(submitButton)
    
    // Wait for validation error to appear
    await waitFor(() => {
      expect(screen.getByText('Bio must be at least 10 characters')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('submits form with valid data', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />)
    
    // Fill in valid form data
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'This is a valid bio with enough characters' } })
    fireEvent.change(screen.getByLabelText('Profile Photo'), { target: { value: 'https://example.com/photo.jpg' } })
    fireEvent.change(screen.getByLabelText('Fund Title'), { target: { value: 'Test Fund' } })
    fireEvent.change(screen.getByLabelText('Fund URL'), { target: { value: 'https://example.com/fund' } })
    
    const submitButton = screen.getByText('Create Profile')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockUpsertProfile).toHaveBeenCalled()
      expect(mockUpdateUserProfile).toHaveBeenCalled()
      expect(mockShowSuccess).toHaveBeenCalledWith('Profile Created!', 'Your activist profile is now live')
      expect(mockOnComplete).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('shows loading state during submission', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />)
    
    // Fill in valid form data
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'This is a valid bio with enough characters' } })
    fireEvent.change(screen.getByLabelText('Profile Photo'), { target: { value: 'https://example.com/photo.jpg' } })
    fireEvent.change(screen.getByLabelText('Fund Title'), { target: { value: 'Test Fund' } })
    fireEvent.change(screen.getByLabelText('Fund URL'), { target: { value: 'https://example.com/fund' } })
    
    const submitButton = screen.getByText('Create Profile')
    fireEvent.click(submitButton)
    
    // Should show loading spinner and button should be disabled
    const button = document.querySelector('button[type="submit"]')
    expect(button).toBeDisabled()
    expect(button?.querySelector('.loading-spinner')).toBeInTheDocument()
  })

  it('handles submission errors', async () => {
    // Mock the upsertProfile to reject
    mockUpsertProfile.mockRejectedValue(new Error('Save failed'))
    
    render(<UserProfileSetup onComplete={mockOnComplete} />)
    
    // Fill in valid form data
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'This is a valid bio with enough characters' } })
    fireEvent.change(screen.getByLabelText('Profile Photo'), { target: { value: 'https://example.com/photo.jpg' } })
    fireEvent.change(screen.getByLabelText('Fund Title'), { target: { value: 'Test Fund' } })
    fireEvent.change(screen.getByLabelText('Fund URL'), { target: { value: 'https://example.com/fund' } })
    
    const submitButton = screen.getByText('Create Profile')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Save Failed', 'Failed to save profile. Please try again.')
    }, { timeout: 3000 })
  })

  it('calls onComplete when back button is clicked', () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />)
    
    const backButton = screen.getByLabelText('Go back')
    fireEvent.click(backButton)
    
    expect(mockOnComplete).toHaveBeenCalled()
  })

  it('shows character count for bio', () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />)
    
    const bioInput = screen.getByLabelText('Bio')
    fireEvent.change(bioInput, { target: { value: 'Test bio' } })
    
    expect(screen.getByText('8/500')).toBeInTheDocument()
  })

  it('shows photo preview when URL is provided', () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />)
    
    const photoInput = screen.getByLabelText('Profile Photo')
    fireEvent.change(photoInput, { target: { value: 'https://example.com/photo.jpg' } })
    
    const preview = screen.getByAltText('Profile preview')
    expect(preview).toBeInTheDocument()
    expect(preview).toHaveAttribute('src', 'https://example.com/photo.jpg')
  })
})
