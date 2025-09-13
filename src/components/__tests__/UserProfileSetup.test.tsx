import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { UserProfileSetup } from '../UserProfileSetup';
import { useAppStore } from '../../store';
import { useToast } from '../../hooks/useToast';
import { githubGistService } from '../../lib/githubGist';

// Mock the CSS import
vi.mock('../UserProfileSetup.css', () => ({}));

// Mock the store
vi.mock('../../store', () => ({
  useAppStore: vi.fn(),
}));

// Mock the toast hook
vi.mock('../../hooks/useToast', () => ({
  useToast: vi.fn(),
}));

// Mock the GitHub Gist service
vi.mock('../../lib/githubGist', () => ({
  githubGistService: {
    readProfiles: vi.fn(),
    updateGist: vi.fn(),
    setGistId: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockUseAppStore = vi.mocked(useAppStore);
const mockUseToast = vi.mocked(useToast);

describe('UserProfileSetup', () => {
  const mockOnComplete = vi.fn();
  const mockUpdateUserProfile = vi.fn();
  const mockUpsertProfile = vi.fn();
  const mockShowSuccess = vi.fn();
  const mockShowError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAppStore.mockReturnValue({
      currentUser: null,
      updateUserProfile: mockUpdateUserProfile,
      upsertProfile: mockUpsertProfile,
      profiles: [],
      likedIds: new Set(),
      passedIds: new Set(),
      chats: {},
      likeProfile: vi.fn(),
      passProfile: vi.fn(),
      setProfiles: vi.fn(),
      ensureChatFor: vi.fn(),
      addUserMessage: vi.fn(),
      removeProfile: vi.fn(),
      deleteUserProfile: vi.fn(),
      isProfileComplete: vi.fn(),
    });

    mockUseToast.mockReturnValue({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showWarning: vi.fn(),
      showInfo: vi.fn(),
    });
  });

  it('renders create profile form for new user', () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    expect(screen.getByText('Créez Votre Profil')).toBeInTheDocument();
    expect(screen.getByLabelText('Photo de Profil')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByLabelText('Âge')).toBeInTheDocument();
    expect(screen.getByLabelText('Biographie')).toBeInTheDocument();
  });

  it('renders edit profile form for existing user', () => {
    const existingUser = {
      id: '1',
      name: 'John Doe',
      age: 25,
      bio: 'Test bio',
      photoUrl: 'https://example.com/photo.jpg',
      location: { lat: 0, lon: 0 },
      strikeFund: { title: 'Test Fund', url: 'https://example.com/fund' },
    };

    mockUseAppStore.mockReturnValue({
      currentUser: existingUser,
      updateUserProfile: mockUpdateUserProfile,
      upsertProfile: mockUpsertProfile,
      profiles: [],
      likedIds: new Set(),
      passedIds: new Set(),
      chats: {},
      likeProfile: vi.fn(),
      passProfile: vi.fn(),
      setProfiles: vi.fn(),
      ensureChatFor: vi.fn(),
      addUserMessage: vi.fn(),
      removeProfile: vi.fn(),
      deleteUserProfile: vi.fn(),
      isProfileComplete: vi.fn(),
    });

    render(<UserProfileSetup onComplete={mockOnComplete} />);

    expect(screen.getByText('Modifier le Profil')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    const submitButton = screen.getByText('Créer le Profil');
    fireEvent.click(submitButton);

    // Wait for validation errors to appear
    await waitFor(
      () => {
        expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
        expect(
          screen.getByText('La biographie est requise')
        ).toBeInTheDocument();
        expect(
          screen.getByText("L'URL de la photo est requise")
        ).toBeInTheDocument();
        expect(
          screen.getByText('Le titre de la caisse de grève est requis')
        ).toBeInTheDocument();
        expect(
          screen.getByText("L'URL de la caisse de grève est requise")
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('validates age range', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    const ageInput = screen.getByLabelText('Âge');
    fireEvent.change(ageInput, { target: { value: '17' } });

    const submitButton = screen.getByText('Créer le Profil');
    fireEvent.click(submitButton);

    // Wait for validation error to appear
    await waitFor(
      () => {
        expect(
          screen.getByText("L'âge doit être entre 18 et 100 ans")
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('validates URL format', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    const photoInput = screen.getByLabelText('Photo de Profil');
    fireEvent.change(photoInput, { target: { value: 'invalid-url' } });

    const submitButton = screen.getByText('Créer le Profil');
    fireEvent.click(submitButton);

    // Wait for the error message to appear after state update
    await waitFor(
      () => {
        expect(
          screen.getByText('Veuillez entrer une URL valide')
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('validates bio minimum length', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    const bioInput = screen.getByLabelText('Biographie');
    fireEvent.change(bioInput, { target: { value: 'Short' } });

    const submitButton = screen.getByText('Créer le Profil');
    fireEvent.click(submitButton);

    // Wait for validation error to appear
    await waitFor(
      () => {
        expect(
          screen.getByText('La biographie doit contenir au moins 10 caractères')
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('submits form with valid data', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Bio'), {
      target: { value: 'This is a valid bio with enough characters' },
    });
    fireEvent.change(screen.getByLabelText('Profile Photo'), {
      target: { value: 'https://example.com/photo.jpg' },
    });
    fireEvent.change(screen.getByLabelText('Fund Title'), {
      target: { value: 'Test Fund' },
    });
    fireEvent.change(screen.getByLabelText('Fund URL'), {
      target: { value: 'https://example.com/fund' },
    });

    const submitButton = screen.getByText('Create Profile');
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(mockUpsertProfile).toHaveBeenCalled();
        expect(mockUpdateUserProfile).toHaveBeenCalled();
        expect(mockShowSuccess).toHaveBeenCalledWith(
          'Profile Created!',
          'Your activist profile is now live'
        );
        expect(mockOnComplete).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('shows loading state during submission', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Bio'), {
      target: { value: 'This is a valid bio with enough characters' },
    });
    fireEvent.change(screen.getByLabelText('Profile Photo'), {
      target: { value: 'https://example.com/photo.jpg' },
    });
    fireEvent.change(screen.getByLabelText('Fund Title'), {
      target: { value: 'Test Fund' },
    });
    fireEvent.change(screen.getByLabelText('Fund URL'), {
      target: { value: 'https://example.com/fund' },
    });

    const submitButton = screen.getByText('Create Profile');
    fireEvent.click(submitButton);

    // Should show loading spinner and button should be disabled
    const button = document.querySelector('button[type="submit"]');
    expect(button).toBeDisabled();
    expect(button?.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('handles submission errors', async () => {
    // Mock the upsertProfile to reject
    mockUpsertProfile.mockRejectedValue(new Error('Save failed'));

    render(<UserProfileSetup onComplete={mockOnComplete} />);

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Bio'), {
      target: { value: 'This is a valid bio with enough characters' },
    });
    fireEvent.change(screen.getByLabelText('Profile Photo'), {
      target: { value: 'https://example.com/photo.jpg' },
    });
    fireEvent.change(screen.getByLabelText('Fund Title'), {
      target: { value: 'Test Fund' },
    });
    fireEvent.change(screen.getByLabelText('Fund URL'), {
      target: { value: 'https://example.com/fund' },
    });

    const submitButton = screen.getByText('Create Profile');
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(mockShowError).toHaveBeenCalledWith(
          'Save Failed',
          'Failed to save profile. Please try again.'
        );
      },
      { timeout: 3000 }
    );
  });

  it('calls onComplete when back button is clicked', () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);

    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('shows character count for bio', () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    const bioInput = screen.getByLabelText('Bio');
    fireEvent.change(bioInput, { target: { value: 'Test bio' } });

    expect(screen.getByText('8/500')).toBeInTheDocument();
  });

  it('shows photo preview when URL is provided', () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    const photoInput = screen.getByLabelText('Profile Photo');
    fireEvent.change(photoInput, {
      target: { value: 'https://example.com/photo.jpg' },
    });

    const preview = screen.getByAltText('Profile preview');
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });
});

describe('UserProfileSetup - Gist Integration', () => {
  const mockOnComplete = vi.fn();
  const mockUpdateUserProfile = vi.fn();
  const mockUpsertProfile = vi.fn();
  const mockShowSuccess = vi.fn();
  const mockShowError = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

    mockUseAppStore.mockReturnValue({
      currentUser: null,
      updateUserProfile: mockUpdateUserProfile,
      upsertProfile: mockUpsertProfile,
      profiles: [],
      likedIds: new Set(),
      passedIds: new Set(),
      chats: {},
      likeProfile: vi.fn(),
      passProfile: vi.fn(),
      setProfiles: vi.fn(),
      ensureChatFor: vi.fn(),
      addUserMessage: vi.fn(),
      removeProfile: vi.fn(),
      deleteUserProfile: vi.fn(),
      isProfileComplete: vi.fn(),
    });

    mockUseToast.mockReturnValue({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showWarning: vi.fn(),
      showInfo: vi.fn(),
    });

    // Mock successful profile operations
    mockUpsertProfile.mockResolvedValue(undefined);
    mockUpdateUserProfile.mockResolvedValue(undefined);
  });

  it('loads GitHub token from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('test-github-token');

    render(<UserProfileSetup onComplete={mockOnComplete} />);

    expect(localStorageMock.getItem).toHaveBeenCalledWith('github_token');
  });

  it('shows Gist section when toggle button is clicked', () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    const toggleButton = screen.getByText('Afficher les Options Gist');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Masquer les Options Gist')).toBeInTheDocument();
    expect(screen.getByLabelText('Token GitHub')).toBeInTheDocument();
  });

  it('saves GitHub token to localStorage when changed', () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    const toggleButton = screen.getByText('Afficher les Options Gist');
    fireEvent.click(toggleButton);

    const tokenInput = screen.getByLabelText('Token GitHub');
    fireEvent.change(tokenInput, { target: { value: 'test-token' } });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'github_token',
      'test-token'
    );
  });

  it('submits profile to Gist when token is provided', async () => {
    const mockGistProfiles = [
      {
        id: 'existing-profile',
        name: 'Existing User',
        age: 30,
        bio: 'Existing bio',
        photoUrl: 'https://example.com/existing.jpg',
        strikeFund: {
          id: 'existing-fund',
          url: 'https://example.com/existing-fund',
          title: 'Existing Fund',
          description: 'Existing description',
          category: 'Test',
          urgency: 'Moyenne',
          currentAmount: 1000,
          targetAmount: 5000,
        },
      },
    ];

    vi.mocked(githubGistService.readProfiles).mockResolvedValue({
      success: true,
      profiles: mockGistProfiles,
    });

    vi.mocked(githubGistService.updateGist).mockResolvedValue({
      success: true,
      gistUrl: 'https://gist.github.com/test-gist',
    });

    render(<UserProfileSetup onComplete={mockOnComplete} />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Âge'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Biographie'), {
      target: { value: 'Test bio content' },
    });
    fireEvent.change(screen.getByLabelText('Photo de Profil'), {
      target: { value: 'https://example.com/photo.jpg' },
    });
    fireEvent.change(screen.getByLabelText('Titre du Fonds'), {
      target: { value: 'Test Fund' },
    });
    fireEvent.change(screen.getByLabelText('URL du Fonds'), {
      target: { value: 'https://example.com/fund' },
    });

    // Add GitHub token
    const toggleButton = screen.getByText('Afficher les Options Gist');
    fireEvent.click(toggleButton);
    fireEvent.change(screen.getByLabelText('Token GitHub'), {
      target: { value: 'test-token' },
    });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /Créer le Profil/,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(githubGistService.readProfiles).toHaveBeenCalled();
      expect(githubGistService.updateGist).toHaveBeenCalled();
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Profil Ajouté au Gist !',
        'Votre profil a été ajouté à la base de données partagée'
      );
    });
  });

  it('handles Gist read error gracefully', async () => {
    vi.mocked(githubGistService.readProfiles).mockResolvedValue({
      success: false,
      error: 'Gist not found',
    });

    render(<UserProfileSetup onComplete={mockOnComplete} />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Âge'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Biographie'), {
      target: { value: 'Test bio content' },
    });
    fireEvent.change(screen.getByLabelText('Photo de Profil'), {
      target: { value: 'https://example.com/photo.jpg' },
    });
    fireEvent.change(screen.getByLabelText('Titre du Fonds'), {
      target: { value: 'Test Fund' },
    });
    fireEvent.change(screen.getByLabelText('URL du Fonds'), {
      target: { value: 'https://example.com/fund' },
    });

    // Add GitHub token
    const toggleButton = screen.getByText('Afficher les Options Gist');
    fireEvent.click(toggleButton);
    fireEvent.change(screen.getByLabelText('Token GitHub'), {
      target: { value: 'test-token' },
    });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /Créer le Profil/,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        'Erreur Gist',
        'Profil créé localement mais impossible de lire le Gist existant'
      );
    });
  });

  it('handles Gist update error gracefully', async () => {
    const mockGistProfiles = [
      {
        id: 'existing-profile',
        name: 'Existing User',
        age: 30,
        bio: 'Existing bio',
        photoUrl: 'https://example.com/existing.jpg',
        strikeFund: {
          id: 'existing-fund',
          url: 'https://example.com/existing-fund',
          title: 'Existing Fund',
          description: 'Existing description',
          category: 'Test',
          urgency: 'Moyenne',
          currentAmount: 1000,
          targetAmount: 5000,
        },
      },
    ];

    vi.mocked(githubGistService.readProfiles).mockResolvedValue({
      success: true,
      profiles: mockGistProfiles,
    });

    vi.mocked(githubGistService.updateGist).mockResolvedValue({
      success: false,
      error: 'Update failed',
    });

    render(<UserProfileSetup onComplete={mockOnComplete} />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Âge'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Biographie'), {
      target: { value: 'Test bio content' },
    });
    fireEvent.change(screen.getByLabelText('Photo de Profil'), {
      target: { value: 'https://example.com/photo.jpg' },
    });
    fireEvent.change(screen.getByLabelText('Titre du Fonds'), {
      target: { value: 'Test Fund' },
    });
    fireEvent.change(screen.getByLabelText('URL du Fonds'), {
      target: { value: 'https://example.com/fund' },
    });

    // Add GitHub token
    const toggleButton = screen.getByText('Afficher les Options Gist');
    fireEvent.click(toggleButton);
    fireEvent.change(screen.getByLabelText('Token GitHub'), {
      target: { value: 'test-token' },
    });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /Créer le Profil/,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        'Erreur Gist',
        "Profil créé localement mais échec de l'ajout au Gist partagé"
      );
    });
  });

  it('saves profile locally even when Gist operations fail', async () => {
    vi.mocked(githubGistService.readProfiles).mockRejectedValue(
      new Error('Network error')
    );

    render(<UserProfileSetup onComplete={mockOnComplete} />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Âge'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Biographie'), {
      target: { value: 'Test bio content' },
    });
    fireEvent.change(screen.getByLabelText('Photo de Profil'), {
      target: { value: 'https://example.com/photo.jpg' },
    });
    fireEvent.change(screen.getByLabelText('Titre du Fonds'), {
      target: { value: 'Test Fund' },
    });
    fireEvent.change(screen.getByLabelText('URL du Fonds'), {
      target: { value: 'https://example.com/fund' },
    });

    // Add GitHub token
    const toggleButton = screen.getByText('Afficher les Options Gist');
    fireEvent.click(toggleButton);
    fireEvent.change(screen.getByLabelText('Token GitHub'), {
      target: { value: 'test-token' },
    });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /Créer le Profil/,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpsertProfile).toHaveBeenCalled();
      expect(mockUpdateUserProfile).toHaveBeenCalled();
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Profil Créé !',
        "Votre profil d'activiste est maintenant en ligne"
      );
    });
  });

  it('does not attempt Gist operations when no token is provided', async () => {
    render(<UserProfileSetup onComplete={mockOnComplete} />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText('Âge'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Biographie'), {
      target: { value: 'Test bio content' },
    });
    fireEvent.change(screen.getByLabelText('Photo de Profil'), {
      target: { value: 'https://example.com/photo.jpg' },
    });
    fireEvent.change(screen.getByLabelText('Titre du Fonds'), {
      target: { value: 'Test Fund' },
    });
    fireEvent.change(screen.getByLabelText('URL du Fonds'), {
      target: { value: 'https://example.com/fund' },
    });

    // Submit form without GitHub token
    const submitButton = screen.getByRole('button', {
      name: /Créer le Profil/,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(githubGistService.readProfiles).not.toHaveBeenCalled();
      expect(githubGistService.updateGist).not.toHaveBeenCalled();
      expect(mockUpsertProfile).toHaveBeenCalled();
      expect(mockUpdateUserProfile).toHaveBeenCalled();
    });
  });
});
