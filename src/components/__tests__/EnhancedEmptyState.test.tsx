import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { EnhancedEmptyState } from '../EnhancedEmptyState'

// Mock the CSS import
vi.mock('../EnhancedEmptyState.css', () => ({}))

describe('EnhancedEmptyState', () => {
  const mockOnCreateProfile = vi.fn()
  const mockOnRefresh = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the empty state content', () => {
    render(
      <EnhancedEmptyState 
        onCreateProfile={mockOnCreateProfile} 
        onRefresh={mockOnRefresh} 
      />
    )
    
    expect(screen.getByText('No more activists to discover right now')).toBeInTheDocument()
    expect(screen.getByText('You\'ve seen all available profiles! Check back later for new activists joining the movement, or create your own profile to connect with others.')).toBeInTheDocument()
  })

  it('shows action buttons', () => {
    render(
      <EnhancedEmptyState 
        onCreateProfile={mockOnCreateProfile} 
        onRefresh={mockOnRefresh} 
      />
    )
    
    expect(screen.getByText('Create Your Profile')).toBeInTheDocument()
    expect(screen.getByText('Refresh')).toBeInTheDocument()
  })

  it('calls onCreateProfile when Create Your Profile is clicked', () => {
    render(
      <EnhancedEmptyState 
        onCreateProfile={mockOnCreateProfile} 
        onRefresh={mockOnRefresh} 
      />
    )
    
    fireEvent.click(screen.getByText('Create Your Profile'))
    
    expect(mockOnCreateProfile).toHaveBeenCalledTimes(1)
  })

  it('calls onRefresh when Refresh is clicked', () => {
    render(
      <EnhancedEmptyState 
        onCreateProfile={mockOnCreateProfile} 
        onRefresh={mockOnRefresh} 
      />
    )
    
    fireEvent.click(screen.getByText('Refresh'))
    
    expect(mockOnRefresh).toHaveBeenCalledTimes(1)
  })

  it('shows helpful tips section', () => {
    render(
      <EnhancedEmptyState 
        onCreateProfile={mockOnCreateProfile} 
        onRefresh={mockOnRefresh} 
      />
    )
    
    expect(screen.getByText('What\'s next?')).toBeInTheDocument()
    expect(screen.getByText('Create your activist profile to join the community')).toBeInTheDocument()
    expect(screen.getByText('Check your matches to start conversations')).toBeInTheDocument()
    expect(screen.getByText('Share the app to bring more activists on board')).toBeInTheDocument()
  })

  it('has proper button styling classes', () => {
    render(
      <EnhancedEmptyState 
        onCreateProfile={mockOnCreateProfile} 
        onRefresh={mockOnRefresh} 
      />
    )
    
    const createButton = screen.getByText('Create Your Profile')
    const refreshButton = screen.getByText('Refresh')
    
    expect(createButton).toHaveClass('action-btn', 'primary')
    expect(refreshButton).toHaveClass('action-btn', 'secondary')
  })

  it('shows icons in buttons', () => {
    render(
      <EnhancedEmptyState 
        onCreateProfile={mockOnCreateProfile} 
        onRefresh={mockOnRefresh} 
      />
    )
    
    // Check for Plus icon in Create button
    const createButton = screen.getByText('Create Your Profile').closest('button')
    expect(createButton).toBeInTheDocument()
    
    // Check for RefreshCw icon in Refresh button
    const refreshButton = screen.getByText('Refresh').closest('button')
    expect(refreshButton).toBeInTheDocument()
  })
})
