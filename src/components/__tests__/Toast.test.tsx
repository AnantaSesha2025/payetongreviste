import React from 'react'
import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import { Toast, ToastContainer, useToast } from '../Toast'

// Mock the CSS import
vi.mock('../Toast.css', () => ({}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('Toast', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders success toast', () => {
    render(
      <Toast
        id="1"
        type="success"
        title="Success!"
        message="Operation completed"
        onClose={mockOnClose}
      />
    )
    
    expect(screen.getByText('Success!')).toBeInTheDocument()
    expect(screen.getByText('Operation completed')).toBeInTheDocument()
  })

  it('renders error toast', () => {
    render(
      <Toast
        id="1"
        type="error"
        title="Error!"
        message="Something went wrong"
        onClose={mockOnClose}
      />
    )
    
    expect(screen.getByText('Error!')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders warning toast', () => {
    render(
      <Toast
        id="1"
        type="warning"
        title="Warning!"
        message="Please be careful"
        onClose={mockOnClose}
      />
    )
    
    expect(screen.getByText('Warning!')).toBeInTheDocument()
    expect(screen.getByText('Please be careful')).toBeInTheDocument()
  })

  it('renders info toast', () => {
    render(
      <Toast
        id="1"
        type="info"
        title="Info"
        message="Here is some information"
        onClose={mockOnClose}
      />
    )
    
    expect(screen.getByText('Info')).toBeInTheDocument()
    expect(screen.getByText('Here is some information')).toBeInTheDocument()
  })

  it('renders without message', () => {
    render(
      <Toast
        id="1"
        type="success"
        title="Success!"
        onClose={mockOnClose}
      />
    )
    
    expect(screen.getByText('Success!')).toBeInTheDocument()
    expect(screen.queryByText('Operation completed')).not.toBeInTheDocument()
  })

  it.skip('calls onClose when close button is clicked', async () => {
    render(
      <Toast
        id="1"
        type="success"
        title="Success!"
        onClose={mockOnClose}
      />
    )
    
    const closeButton = screen.getByLabelText('Close notification')
    fireEvent.click(closeButton)
    
    // Wait for the 300ms delay in handleClose
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledWith('1')
    }, { timeout: 1000 })
  })

  it.skip('auto-closes after duration', async () => {
    render(
      <Toast
        id="1"
        type="success"
        title="Success!"
        duration={1000}
        onClose={mockOnClose}
      />
    )
    
    // Fast-forward time past duration + 300ms delay
    vi.advanceTimersByTime(1300)
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledWith('1')
    })
  })

  it('applies correct CSS classes for different types', () => {
    const { rerender } = render(
      <Toast
        id="1"
        type="success"
        title="Success!"
        onClose={mockOnClose}
      />
    )
    
    let toast = document.querySelector('.toast')
    expect(toast).toHaveClass('toast--success')

    rerender(
      <Toast
        id="1"
        type="error"
        title="Error!"
        onClose={mockOnClose}
      />
    )
    
    toast = document.querySelector('.toast')
    expect(toast).toHaveClass('toast--error')
  })
})

describe('ToastContainer', () => {
  const mockOnClose = vi.fn()
  const mockToasts = [
    {
      id: '1',
      type: 'success' as const,
      title: 'Success!',
      message: 'First toast'
    },
    {
      id: '2',
      type: 'error' as const,
      title: 'Error!',
      message: 'Second toast'
    }
  ]

  it('renders multiple toasts', () => {
    render(<ToastContainer toasts={mockToasts} onClose={mockOnClose} />)
    
    expect(screen.getByText('Success!')).toBeInTheDocument()
    expect(screen.getByText('Error!')).toBeInTheDocument()
  })

  it('calls onClose for each toast', async () => {
    render(<ToastContainer toasts={mockToasts} onClose={mockOnClose} />)
    
    const closeButtons = screen.getAllByLabelText('Close notification')
    fireEvent.click(closeButtons[0])
    
    // Wait for the 300ms delay in handleClose
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledWith('1')
    }, { timeout: 1000 })
  })

  it('renders empty container when no toasts', () => {
    render(<ToastContainer toasts={[]} onClose={mockOnClose} />)
    
    expect(screen.queryByText('Success!')).not.toBeInTheDocument()
    expect(screen.queryByText('Error!')).not.toBeInTheDocument()
  })
})

describe('useToast hook', () => {
  it('provides toast management functions', () => {
    const { result } = renderHook(useToast)
    
    expect(result.current).toBeDefined()
    expect(result.current.showSuccess).toBeInstanceOf(Function)
    expect(result.current.showError).toBeInstanceOf(Function)
    expect(result.current.showWarning).toBeInstanceOf(Function)
    expect(result.current.showInfo).toBeInstanceOf(Function)
    expect(result.current.addToast).toBeInstanceOf(Function)
    expect(result.current.removeToast).toBeInstanceOf(Function)
  })
})

// Using renderHook from @testing-library/react

// No need to mock useToast since we're testing the real implementation
