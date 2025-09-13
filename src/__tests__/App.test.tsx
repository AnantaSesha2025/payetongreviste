import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

// Mock all page components
vi.mock('../pages/DiscoverPage', () => ({
  default: () => <div data-testid="discover-page">Discover Page</div>
}))

vi.mock('../pages/MatchesPage', () => ({
  default: () => <div data-testid="matches-page">Matches Page</div>
}))

vi.mock('../pages/ProfilePage', () => ({
  default: () => <div data-testid="profile-page">Profile Page</div>
}))

vi.mock('../pages/ActivistSetupPage', () => ({
  default: () => <div data-testid="activist-page">Activist Setup Page</div>
}))

// Mock CSS import
vi.mock('../App.css', () => ({}))

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

describe('App Component', () => {
  it('renders navigation links', () => {
    render(<AppWithRouter />)
    
    expect(screen.getByText('Discover')).toBeInTheDocument()
    expect(screen.getByText('Matches')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Activist')).toBeInTheDocument()
  })

  it('renders discover page by default', () => {
    render(<AppWithRouter />)
    
    expect(screen.getByTestId('discover-page')).toBeInTheDocument()
  })

  it('has correct CSS classes', () => {
    render(<AppWithRouter />)
    
    const appElement = screen.getByTestId('discover-page').closest('.app')
    expect(appElement).toBeInTheDocument()
    
    const headerElement = appElement?.querySelector('.app-header')
    expect(headerElement).toBeInTheDocument()
    
    const mainElement = appElement?.querySelector('.app-main')
    expect(mainElement).toBeInTheDocument()
    
    const navElement = appElement?.querySelector('.nav')
    expect(navElement).toBeInTheDocument()
  })

  it('renders all navigation links as NavLink components', () => {
    render(<AppWithRouter />)
    
    const discoverLink = screen.getByText('Discover')
    const matchesLink = screen.getByText('Matches')
    const profileLink = screen.getByText('Profile')
    const activistLink = screen.getByText('Activist')
    
    expect(discoverLink).toHaveAttribute('href', '/')
    expect(matchesLink).toHaveAttribute('href', '/matches')
    expect(profileLink).toHaveAttribute('href', '/profile')
    expect(activistLink).toHaveAttribute('href', '/activist')
  })
})
