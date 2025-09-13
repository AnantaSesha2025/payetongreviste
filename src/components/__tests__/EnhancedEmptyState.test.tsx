import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { EnhancedEmptyState } from '../EnhancedEmptyState';

// Mock the CSS import
vi.mock('../EnhancedEmptyState.css', () => ({}));

describe('EnhancedEmptyState', () => {
  const mockOnCreateProfile = vi.fn();
  const mockOnRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the empty state content', () => {
    render(
      <EnhancedEmptyState
        onCreateProfile={mockOnCreateProfile}
        onRefresh={mockOnRefresh}
      />
    );

    expect(
      screen.getByText("Plus d'activistes à découvrir pour le moment")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Vous avez vu tous les profils disponibles ! Revenez plus tard pour de nouveaux activistes rejoignant le mouvement, ou créez votre propre profil pour vous connecter avec d'autres."
      )
    ).toBeInTheDocument();
  });

  it('shows action buttons', () => {
    render(
      <EnhancedEmptyState
        onCreateProfile={mockOnCreateProfile}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText('Créer Votre Profil')).toBeInTheDocument();
    expect(screen.getByText('Actualiser')).toBeInTheDocument();
  });

  it('calls onCreateProfile when Créer Votre Profil is clicked', () => {
    render(
      <EnhancedEmptyState
        onCreateProfile={mockOnCreateProfile}
        onRefresh={mockOnRefresh}
      />
    );

    fireEvent.click(screen.getByText('Créer Votre Profil'));

    expect(mockOnCreateProfile).toHaveBeenCalledTimes(1);
  });

  it('calls onRefresh when Actualiser is clicked', () => {
    render(
      <EnhancedEmptyState
        onCreateProfile={mockOnCreateProfile}
        onRefresh={mockOnRefresh}
      />
    );

    fireEvent.click(screen.getByText('Actualiser'));

    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('shows helpful tips section', () => {
    render(
      <EnhancedEmptyState
        onCreateProfile={mockOnCreateProfile}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText('Et maintenant ?')).toBeInTheDocument();
    expect(
      screen.getByText(
        "Créez votre profil d'activiste pour rejoindre la communauté"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Consultez vos correspondances pour commencer des conversations'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Partagez l'application pour amener plus d'activistes à bord"
      )
    ).toBeInTheDocument();
  });

  it('has proper button styling classes', () => {
    render(
      <EnhancedEmptyState
        onCreateProfile={mockOnCreateProfile}
        onRefresh={mockOnRefresh}
      />
    );

    const createButton = screen.getByText('Créer Votre Profil');
    const refreshButton = screen.getByText('Actualiser');

    expect(createButton).toHaveClass('action-btn', 'primary');
    expect(refreshButton).toHaveClass('action-btn', 'secondary');
  });

  it('shows icons in buttons', () => {
    render(
      <EnhancedEmptyState
        onCreateProfile={mockOnCreateProfile}
        onRefresh={mockOnRefresh}
      />
    );

    // Check for Plus icon in Create button
    const createButton = screen
      .getByText('Créer Votre Profil')
      .closest('button');
    expect(createButton).toBeInTheDocument();

    // Check for RefreshCw icon in Actualiser button
    const refreshButton = screen.getByText('Actualiser').closest('button');
    expect(refreshButton).toBeInTheDocument();
  });
});
