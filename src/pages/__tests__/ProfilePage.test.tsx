import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import ProfilePage from '../ProfilePage'

describe('ProfilePage Component', () => {
  it('renders form with name and bio fields', () => {
    render(<ProfilePage />)
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Bio')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('has default values for name and bio', () => {
    render(<ProfilePage />)
    
    const nameInput = screen.getByDisplayValue('You')
    const bioTextarea = screen.getByDisplayValue('Hello there!')
    
    expect(nameInput).toBeInTheDocument()
    expect(bioTextarea).toBeInTheDocument()
  })

  it('allows editing name field', () => {
    render(<ProfilePage />)
    
    const nameInput = screen.getByDisplayValue('You')
    fireEvent.change(nameInput, { target: { value: 'New Name' } })
    
    expect(nameInput).toHaveValue('New Name')
  })

  it('allows editing bio field', () => {
    render(<ProfilePage />)
    
    const bioTextarea = screen.getByDisplayValue('Hello there!')
    fireEvent.change(bioTextarea, { target: { value: 'New bio content' } })
    
    expect(bioTextarea).toHaveValue('New bio content')
  })

  it('shows saved confirmation when form is submitted', () => {
    render(<ProfilePage />)
    
    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)
    
    expect(screen.getByText('Saved!')).toBeInTheDocument()
  })

  it('hides saved confirmation after timeout', async () => {
    vi.useFakeTimers()
    
    render(<ProfilePage />)
    
    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)
    
    expect(screen.getByText('Saved!')).toBeInTheDocument()
    
    // Fast-forward time past the 1200ms timeout
    act(() => {
      vi.advanceTimersByTime(1300)
    })

    expect(screen.queryByText('Saved!')).not.toBeInTheDocument()
    
    vi.useRealTimers()
  })

  it('prevents default form submission', () => {
    render(<ProfilePage />)
    
    const form = document.querySelector('form')
    expect(form).not.toBeNull()
    
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    const preventDefault = vi.fn()
    submitEvent.preventDefault = preventDefault
    
    fireEvent(form!, submitEvent)
    
    expect(preventDefault).toHaveBeenCalled()
  })
})
