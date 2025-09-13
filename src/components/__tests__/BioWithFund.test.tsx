import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BioWithFund } from '../BioWithFund'

const mockFund = {
  url: 'https://example.com/fund',
  title: 'Test Strike Fund'
}

describe('BioWithFund Component', () => {
  it('renders bio with last word as clickable link', () => {
    const bio = 'This is a test bio with fund'
    render(<BioWithFund bio={bio} fund={mockFund} />)
    
    expect(screen.getByText('This is a test bio with')).toBeInTheDocument()
    expect(screen.getByText('fund')).toBeInTheDocument()
    expect(screen.getByText('fund')).toHaveAttribute('href', 'https://example.com/fund')
    expect(screen.getByText('fund')).toHaveAttribute('target', '_blank')
    expect(screen.getByText('fund')).toHaveAttribute('rel', 'noreferrer')
  })

  it('renders only fund link when bio is empty', () => {
    render(<BioWithFund bio="" fund={mockFund} />)
    
    expect(screen.getByText('Test Strike Fund')).toBeInTheDocument()
    expect(screen.getByText('Test Strike Fund')).toHaveAttribute('href', 'https://example.com/fund')
    expect(screen.getByText('Test Strike Fund')).toHaveAttribute('target', '_blank')
    expect(screen.getByText('Test Strike Fund')).toHaveAttribute('rel', 'noreferrer')
  })

  it('renders only fund link when bio is whitespace only', () => {
    render(<BioWithFund bio="   " fund={mockFund} />)
    
    expect(screen.getByText('Test Strike Fund')).toBeInTheDocument()
    expect(screen.getByText('Test Strike Fund')).toHaveAttribute('href', 'https://example.com/fund')
  })

  it('handles single word bio correctly', () => {
    render(<BioWithFund bio="fund" fund={mockFund} />)
    
    expect(screen.getByText('fund')).toBeInTheDocument()
    expect(screen.getByText('fund')).toHaveAttribute('href', 'https://example.com/fund')
  })

  it('handles bio with multiple spaces correctly', () => {
    const bio = 'This   is   a   test   bio   with   fund'
    render(<BioWithFund bio={bio} fund={mockFund} />)
    
    expect(screen.getByText('This is a test bio with')).toBeInTheDocument()
    expect(screen.getByText('fund')).toBeInTheDocument()
    expect(screen.getByText('fund')).toHaveAttribute('href', 'https://example.com/fund')
  })

  it('applies correct CSS class to fund link', () => {
    render(<BioWithFund bio="test bio with fund" fund={mockFund} />)
    
    const fundLink = screen.getByText('fund')
    expect(fundLink).toHaveClass('link-blue')
  })

  it('handles different fund titles', () => {
    const customFund = {
      url: 'https://example.com/custom-fund',
      title: 'Custom Strike Fund Title'
    }
    
    render(<BioWithFund bio="" fund={customFund} />)
    
    expect(screen.getByText('Custom Strike Fund Title')).toBeInTheDocument()
    expect(screen.getByText('Custom Strike Fund Title')).toHaveAttribute('href', 'https://example.com/custom-fund')
  })
})
