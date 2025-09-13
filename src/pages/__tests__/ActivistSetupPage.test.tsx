import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import ActivistSetupPage from '../ActivistSetupPage'
import { useAppStore } from '../../store'

// Mock UserProfileSetup component
vi.mock('../../components/UserProfileSetup', () => ({
  UserProfileSetup: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="user-profile-setup">
      <h1>Create Your Profile</h1>
      <button onClick={onComplete}>Complete Profile</button>
    </div>
  )
}))

// Mock the store
vi.mock('../../store', () => ({
  useAppStore: vi.fn(),
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockStore = {
  profiles: [],
  upsertProfile: vi.fn(),
  removeProfile: vi.fn(),
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ActivistSetupPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAppStore).mockReturnValue(mockStore)
  })

  it('renders user profile setup component', () => {
    renderWithRouter(<ActivistSetupPage />)
    
    expect(screen.getByTestId('user-profile-setup')).toBeInTheDocument()
    expect(screen.getByText('Create Your Profile')).toBeInTheDocument()
  })

  it('calls onComplete when profile is completed', () => {
    renderWithRouter(<ActivistSetupPage />)
    
    const completeButton = screen.getByText('Complete Profile')
    fireEvent.click(completeButton)
    
    // Should navigate to home page
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('renders without crashing', () => {
    renderWithRouter(<ActivistSetupPage />)
    
    expect(screen.getByTestId('user-profile-setup')).toBeInTheDocument()
  })
})