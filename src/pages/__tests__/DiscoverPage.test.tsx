import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DiscoverPage from '../DiscoverPage'

// Mock the SwipeDeck component
vi.mock('../../components/SwipeDeck', () => ({
  SwipeDeck: () => <div data-testid="swipe-deck">SwipeDeck Component</div>
}))

describe('DiscoverPage Component', () => {
  it('renders SwipeDeck component', () => {
    render(<DiscoverPage />)
    
    expect(screen.getByTestId('swipe-deck')).toBeInTheDocument()
  })

  it('has correct CSS class', () => {
    render(<DiscoverPage />)
    
    const discoverElement = screen.getByTestId('swipe-deck').parentElement
    expect(discoverElement).toHaveClass('discover')
  })
})
