import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import DiscoverPage from '../DiscoverPage'

// Mock the SwipeDeck component
vi.mock('../../components/SwipeDeck', () => ({
  SwipeDeck: () => <div data-testid="swipe-deck">SwipeDeck Component</div>
}))

const DiscoverPageWithRouter = () => (
  <BrowserRouter>
    <DiscoverPage />
  </BrowserRouter>
)

describe('DiscoverPage Component', () => {
  it('renders SwipeDeck component', () => {
    render(<DiscoverPageWithRouter />)
    
    expect(screen.getByTestId('swipe-deck')).toBeInTheDocument()
  })

  it('has correct CSS class', () => {
    render(<DiscoverPageWithRouter />)
    
    const discoverElement = screen.getByTestId('swipe-deck').parentElement?.parentElement
    expect(discoverElement).toHaveClass('discover')
  })

  it('renders discover header with title and activist sublink', () => {
    render(<DiscoverPageWithRouter />)
    
    expect(screen.getByText('Discover Activists')).toBeInTheDocument()
    expect(screen.getByText('Create Profile')).toBeInTheDocument()
  })

  it('has activist sublink with correct href', () => {
    render(<DiscoverPageWithRouter />)
    
    const activistLink = screen.getByText('Create Profile').closest('a')
    expect(activistLink).toHaveAttribute('href', '/activist')
  })

  it('has discover header with correct CSS class', () => {
    render(<DiscoverPageWithRouter />)
    
    const headerElement = screen.getByText('Discover Activists').closest('div')
    expect(headerElement).toHaveClass('discover-header')
  })
})
