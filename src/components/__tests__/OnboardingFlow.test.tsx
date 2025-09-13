import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { OnboardingFlow } from '../OnboardingFlow';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock the CSS import
vi.mock('../OnboardingFlow.css', () => ({}));

describe('OnboardingFlow', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the first step with welcome content', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />);

    await waitFor(
      () => {
        expect(
          screen.getByText('Bienvenue sur PayeTonGréviste')
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            'Connectez-vous avec des activistes qui luttent pour le changement'
          )
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            'Découvrez des activistes partageant vos idées, soutenez leurs causes et créez des liens significatifs dans la lutte pour la justice sociale.'
          )
        ).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });

  it('shows progress indicators', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />);

    await waitFor(
      () => {
        const progressDots = screen
          .getAllByRole('generic')
          .filter(el => el.className.includes('progress-dot'));
        expect(progressDots).toHaveLength(4);
        expect(progressDots[0]).toHaveClass('active');
      },
      { timeout: 100 }
    );
  });

  it('navigates through all steps with Next button', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />);

    // Step 1: Welcome
    await waitFor(
      () => {
        expect(
          screen.getByText('Bienvenue sur PayeTonGréviste')
        ).toBeInTheDocument();
      },
      { timeout: 100 }
    );

    // Click Suivant
    fireEvent.click(screen.getByText('Suivant'));

    // Step 2: Swipe to Connect
    await waitFor(() => {
      expect(
        screen.getByText('Glissez pour vous Connecter')
      ).toBeInTheDocument();
    });

    // Click Suivant
    fireEvent.click(screen.getByText('Suivant'));

    // Step 3: Support Causes
    await waitFor(() => {
      expect(screen.getByText('Soutenir les Causes')).toBeInTheDocument();
    });

    // Click Suivant
    fireEvent.click(screen.getByText('Suivant'));

    // Step 4: Create Your Profile
    await waitFor(() => {
      expect(screen.getByText('Créez Votre Profil')).toBeInTheDocument();
    });
  });

  it('shows gesture tutorial on step 2', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />);

    // Navigate to step 2
    fireEvent.click(screen.getByText('Suivant'));

    await waitFor(() => {
      expect(
        screen.getByText('Glissez pour vous Connecter')
      ).toBeInTheDocument();
      expect(screen.getByText('Apprenez les gestes')).toBeInTheDocument();
      expect(screen.getByText('Détails')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Passer' })
      ).toBeInTheDocument();
      expect(screen.getByText('Aimer')).toBeInTheDocument();
    });
  });

  it('calls onComplete when Get Started is clicked on last step', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />);

    // Navigate to last step
    fireEvent.click(screen.getByText('Suivant'));
    fireEvent.click(screen.getByText('Suivant'));
    fireEvent.click(screen.getByText('Suivant'));

    await waitFor(() => {
      expect(screen.getByText('Commencer')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Commencer'));

    await waitFor(
      () => {
        expect(mockOnComplete).toHaveBeenCalledTimes(1);
      },
      { timeout: 500 }
    );
  });

  it('calls onComplete when Skip is clicked', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />);

    fireEvent.click(screen.getByText('Passer'));

    await waitFor(
      () => {
        expect(mockOnComplete).toHaveBeenCalledTimes(1);
      },
      { timeout: 500 }
    );
  });

  it('shows correct button text for each step', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />);

    // Step 1-3 should show "Suivant"
    await waitFor(
      () => {
        expect(screen.getByText('Suivant')).toBeInTheDocument();
      },
      { timeout: 100 }
    );

    // Navigate to last step
    fireEvent.click(screen.getByText('Suivant'));
    fireEvent.click(screen.getByText('Suivant'));
    fireEvent.click(screen.getByText('Suivant'));

    await waitFor(() => {
      expect(screen.getByText('Commencer')).toBeInTheDocument();
    });
  });

  it('updates progress indicators as user progresses', async () => {
    render(<OnboardingFlow onComplete={mockOnComplete} />);

    let progressDots: HTMLElement[];

    await waitFor(
      () => {
        progressDots = screen
          .getAllByRole('generic')
          .filter(el => el.className.includes('progress-dot'));

        // First dot should be active initially
        expect(progressDots[0]).toHaveClass('active');
      },
      { timeout: 100 }
    );

    // Click Suivant to go to step 2
    fireEvent.click(screen.getByText('Suivant'));

    await waitFor(
      () => {
        // First two dots should be active
        expect(progressDots[0]).toHaveClass('active');
        expect(progressDots[1]).toHaveClass('active');
      },
      { timeout: 100 }
    );
  });
});
