import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { LoadingSpinner, LoadingOverlay, InlineLoader } from '../LoadingSpinner'

// Mock the CSS import
vi.mock('../LoadingSpinner.css', () => ({}))

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Please wait..." />)
    
    expect(screen.getByText('Please wait...')).toBeInTheDocument()
  })

  it('hides text when showText is false', () => {
    render(<LoadingSpinner showText={false} />)
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />)
    let spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('spinner-small')

    rerender(<LoadingSpinner size="medium" />)
    spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('spinner-medium')

    rerender(<LoadingSpinner size="large" />)
    spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('spinner-large')
  })

  it('applies correct color classes', () => {
    const { rerender } = render(<LoadingSpinner color="primary" />)
    let spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('spinner-primary')

    rerender(<LoadingSpinner color="white" />)
    spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('spinner-white')

    rerender(<LoadingSpinner color="black" />)
    spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('spinner-black')
  })

  it('has spinning animation', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
  })
})

describe('LoadingOverlay', () => {
  it('renders full-screen overlay', () => {
    render(<LoadingOverlay />)
    
    const overlay = screen.getByTestId('loading-overlay')
    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveClass('loading-overlay')
  })

  it('renders with custom text', () => {
    render(<LoadingOverlay text="Initializing..." />)
    
    expect(screen.getByText('Initializing...')).toBeInTheDocument()
  })

  it('uses large spinner size', () => {
    render(<LoadingOverlay />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('spinner-large')
  })
})

describe('InlineLoader', () => {
  it('renders inline loader', () => {
    render(<InlineLoader />)
    
    const loader = screen.getByTestId('inline-loader')
    expect(loader).toBeInTheDocument()
  })

  it('does not show text', () => {
    render(<InlineLoader />)
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('applies correct size', () => {
    const { rerender } = render(<InlineLoader size="small" />)
    let spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('spinner-small')

    rerender(<InlineLoader size="medium" />)
    spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('spinner-medium')
  })
})
