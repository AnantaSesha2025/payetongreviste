import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { OnboardingFlow } from '../OnboardingFlow'

// Mock the CSS import
vi.mock('../OnboardingFlow.css', () => ({}))

describe('OnboardingFlow', () => {
  const mockOnComplete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the first step with welcome content', () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    expect(screen.getByText('Welcome to PayeTonGreviste')).toBeInTheDocument()
    expect(screen.getByText('Connect with activists fighting for change')).toBeInTheDocument()
    expect(screen.getByText('Discover like-minded activists, support their causes, and build meaningful connections in the fight for social justice.')).toBeInTheDocument()
  })

  it('shows progress indicators', () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    const progressDots = screen.getAllByRole('generic').filter(el => 
      el.className.includes('progress-dot')
    )
    expect(progressDots).toHaveLength(4)
    expect(progressDots[0]).toHaveClass('active')
  })

  it('navigates through all steps with Next button', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Step 1: Welcome
    expect(screen.getByText('Welcome to PayeTonGreviste')).toBeInTheDocument()
    
    // Click Next
    fireEvent.click(screen.getByText('Next'))
    
    // Step 2: Swipe to Connect
    await waitFor(() => {
      expect(screen.getByText('Swipe to Connect')).toBeInTheDocument()
    })
    
    // Click Next
    fireEvent.click(screen.getByText('Next'))
    
    // Step 3: Support Causes
    await waitFor(() => {
      expect(screen.getByText('Support Causes')).toBeInTheDocument()
    })
    
    // Click Next
    fireEvent.click(screen.getByText('Next'))
    
    // Step 4: Create Your Profile
    await waitFor(() => {
      expect(screen.getByText('Create Your Profile')).toBeInTheDocument()
    })
  })

  it('shows gesture tutorial on step 2', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Navigate to step 2
    fireEvent.click(screen.getByText('Next'))
    
    await waitFor(() => {
      expect(screen.getByText('Swipe to Connect')).toBeInTheDocument()
      expect(screen.getByText('Learn the gestures')).toBeInTheDocument()
      expect(screen.getByText('Details')).toBeInTheDocument()
      expect(screen.getByText('Pass')).toBeInTheDocument()
      expect(screen.getByText('Like')).toBeInTheDocument()
    })
  })

  it('calls onComplete when Get Started is clicked on last step', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Navigate to last step
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    
    await waitFor(() => {
      expect(screen.getByText('Get Started')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Get Started'))
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1)
    }, { timeout: 1000 })
  })

  it('calls onComplete when Skip is clicked', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    fireEvent.click(screen.getByText('Skip'))
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1)
    }, { timeout: 1000 })
  })

  it('shows correct button text for each step', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    // Step 1-3 should show "Next"
    expect(screen.getByText('Next')).toBeInTheDocument()
    
    // Navigate to last step
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Next'))
    
    await waitFor(() => {
      expect(screen.getByText('Get Started')).toBeInTheDocument()
    })
  })

  it('updates progress indicators as user progresses', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />)
    
    const progressDots = screen.getAllByRole('generic').filter(el => 
      el.className.includes('progress-dot')
    )
    
    // First dot should be active initially
    expect(progressDots[0]).toHaveClass('active')
    
    // Click Next to go to step 2
    fireEvent.click(screen.getByText('Next'))
    
    await waitFor(() => {
      // First two dots should be active
      expect(progressDots[0]).toHaveClass('active')
      expect(progressDots[1]).toHaveClass('active')
    })
  })
})
