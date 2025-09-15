import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { Card } from './Card';
import { EnhancedEmptyState } from './EnhancedEmptyState';
import { SwipeDeckSkeleton } from './ProfileSkeleton';
import { useToast } from '../hooks/useToast';
import { useSwipeHistory } from '../hooks/useUndo';
// import { BioWithFund } from './BioWithFund'
import { Heart, Plus, X, ArrowDown, RotateCcw } from 'react-feather';
import { mockProfiles, useAppStore } from '../store';
import { githubGistService } from '../lib/githubGist';
import { convertGistProfileToAppProfile } from '../lib/fakeProfiles';
import { DEFAULT_GIST_ID } from '../lib/constants';
import { haversineKm } from '../lib/geo';
import './SwipeDeck.css';

/**
 * Main swipe deck component that manages the card stack and user interactions.
 * Displays profiles in a stack with the current card on top and next card previewed behind.
 * Handles swipe gestures and provides action buttons for pass, like, and details.
 *
 * @returns JSX element representing the swipe deck interface
 */
export function SwipeDeck({
  onCreateProfile,
  userLocation: externalUserLocation,
  maxDistance: externalMaxDistance,
  sortByDistance: externalSortByDistance,
}: {
  onCreateProfile: () => void;
  userLocation?: { lat: number; lon: number } | null;
  maxDistance?: number;
  sortByDistance?: boolean;
}) {
  const { profiles, setProfiles, likeProfile, passProfile } = useAppStore();
  const { showSuccess, showInfo } = useToast();
  const { recordSwipe, undoLastSwipe, canUndo, getUndoableAction } =
    useSwipeHistory();
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(externalUserLocation || null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [locationRequested, setLocationRequested] = useState<boolean>(false);
  const [maxDistance, setMaxDistance] = useState<number>(
    externalMaxDistance || 50
  ); // Default 50km radius
  const [sortByDistance, setSortByDistance] = useState<boolean>(
    externalSortByDistance ?? true
  );

  // Auto-dismiss location messages after 3 seconds
  useEffect(() => {
    if (locationError || locationSuccess) {
      const timer = setTimeout(() => {
        setLocationError(null);
        setLocationSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [locationError, locationSuccess]);

  // Function to load profiles from your Gist
  const loadProfilesFromGist = useCallback(async () => {
    try {
      const gistId = DEFAULT_GIST_ID;
      const result = await githubGistService.readProfiles(gistId);

      if (result.success && result.profiles && result.profiles.length > 0) {
        // Convert Gist profiles to app format
        const appProfiles = result.profiles.map(convertGistProfileToAppProfile);
        setProfiles(appProfiles);
        console.log('Loaded profiles from Gist:', appProfiles.length);
      } else {
        // Fallback to mock data if Gist is empty or fails
        console.log('Gist is empty or failed to load, using mock data');
        setProfiles(mockProfiles);
      }
    } catch (error) {
      // Fallback to mock data on error
      console.error('Error loading from Gist, using mock data:', error);
      setProfiles(mockProfiles);
    } finally {
      setIsLoading(false);
    }
  }, [setProfiles]);

  // Initialize profiles from Gist or mock data if none exist
  useEffect(() => {
    if (profiles.length === 0) {
      // In test environment, load mock data immediately
      if (import.meta.env.MODE === 'test') {
        setProfiles(mockProfiles);
        setIsLoading(false);
      } else {
        // Load from your existing Gist
        loadProfilesFromGist();
      }
    } else {
      setIsLoading(false);
    }
  }, [profiles.length, setProfiles, loadProfilesFromGist]);

  // Sync with external props
  useEffect(() => {
    if (externalUserLocation) {
      setUserLocation(externalUserLocation);
    }
  }, [externalUserLocation]);

  useEffect(() => {
    if (externalMaxDistance !== undefined) {
      setMaxDistance(externalMaxDistance);
    }
  }, [externalMaxDistance]);

  useEffect(() => {
    if (externalSortByDistance !== undefined) {
      setSortByDistance(externalSortByDistance);
    }
  }, [externalSortByDistance]);

  // Set Paris as default location on component mount if no external location
  useEffect(() => {
    if (!userLocation && !locationRequested && !externalUserLocation) {
      // Set Paris as default without requesting permission
      setUserLocation({ lat: 48.8566, lon: 2.3522 });
      setLocationRequested(true);
    }
  }, [userLocation, locationRequested, externalUserLocation]);

  // Filter and sort profiles by distance
  const filteredProfiles = useMemo(() => {
    if (!userLocation) {
      return profiles; // Show all profiles if no location
    }

    // Filter profiles that have valid location data
    const profilesWithLocation = profiles.filter(
      p =>
        p.location &&
        typeof p.location.lat === 'number' &&
        typeof p.location.lon === 'number'
    );

    // If no profiles have location data, show all profiles
    if (profilesWithLocation.length === 0) {
      return profiles;
    }

    // Calculate distance for each profile and filter by max distance
    const profilesWithDistance = profilesWithLocation
      .map(profile => ({
        ...profile,
        distance: haversineKm(userLocation, profile.location),
      }))
      .filter(profile => profile.distance <= maxDistance);

    // If all profiles are being filtered out due to distance, show all profiles with location data
    if (profilesWithDistance.length === 0) {
      return profilesWithLocation.map(profile => ({
        ...profile,
        distance: haversineKm(userLocation, profile.location),
      }));
    }

    // Sort by distance if enabled
    if (sortByDistance) {
      return profilesWithDistance.sort((a, b) => a.distance - b.distance);
    }

    return profilesWithDistance;
  }, [profiles, userLocation, maxDistance, sortByDistance]);

  // Get current and next profile for the card stack
  const current = filteredProfiles[index];
  const next = filteredProfiles[index + 1];

  // Handle refresh - reset to beginning of profiles
  const handleRefresh = () => {
    setIndex(0);
    // In a real app, this would reload profiles from server
  };

  /**
   * Handles user choice when swiping or clicking action buttons
   * @param dir - Direction of the swipe ('left' for pass, 'right' for like)
   */
  const handleChoice = (dir: 'left' | 'right') => {
    if (!current) return;

    // Record the swipe action for undo functionality
    recordSwipe(dir === 'right' ? 'like' : 'pass', current.id);

    if (dir === 'right') {
      likeProfile(current.id);
      showSuccess('Profil Aimé !', `Vous avez aimé ${current.name}`);
    } else {
      passProfile(current.id);
      showInfo('Profil Passé', `Vous avez passé sur ${current.name}`);
    }

    setIndex(v => v + 1);
  };

  /**
   * Handles undo action
   */
  const handleUndo = () => {
    if (!canUndo) return;

    const undoableAction = getUndoableAction();
    if (!undoableAction) return;

    // Move back one step
    setIndex(v => Math.max(0, v - 1));

    // Remove the action from store
    if (undoableAction.type === 'like') {
      // Remove from liked and chats
      const { likedIds, chats } = useAppStore.getState();
      const newLikedIds = new Set(likedIds);
      newLikedIds.delete(undoableAction.profileId);

      const newChats = { ...chats };
      delete newChats[undoableAction.profileId];

      useAppStore.setState({ likedIds: newLikedIds, chats: newChats });
    } else {
      // Remove from passed
      const { passedIds } = useAppStore.getState();
      const newPassedIds = new Set(passedIds);
      newPassedIds.delete(undoableAction.profileId);

      useAppStore.setState({ passedIds: newPassedIds });
    }

    // Remove from history
    undoLastSwipe();

    showInfo('Annulé', 'Dernière action annulée');
  };

  // State for managing details modal visibility
  const [showDetails, setShowDetails] = useState(false);
  const openDetails = () => setShowDetails(true);
  const closeDetails = () => setShowDetails(false);

  // Show loading state
  if (isLoading) {
    return (
      <div className="deck">
        <SwipeDeckSkeleton />
      </div>
    );
  }

  return (
    <div className="deck">
      {/* Location status indicators */}
      {locationError && (
        <div className="location-error">
          <span>{locationError}</span>
        </div>
      )}
      {locationSuccess && (
        <div className="location-success">
          <span>{locationSuccess}</span>
        </div>
      )}

      {/* Next card (behind) */}
      {next && <Card profile={next} disabled />}

      {/* Current card (on top) */}
      {current ? (
        <Card
          key={current.id}
          profile={current}
          onSwipe={handleChoice}
          onSwipeUp={openDetails}
        />
      ) : (
        <EnhancedEmptyState
          onCreateProfile={onCreateProfile}
          onRefresh={handleRefresh}
        />
      )}

      <ActionBar
        onPass={() => handleChoice('left')}
        onLike={() => handleChoice('right')}
        onDetails={openDetails}
        onUndo={handleUndo}
        canUndo={canUndo}
      />
      <AnimatePresence>
        {showDetails && current && (
          <DetailsModal
            key="details-modal"
            onClose={closeDetails}
            name={current.name}
            age={current.age}
            bio={current.bio}
            strikeUrl={current.strikeFund.url}
            strikeTitle={current.strikeFund.title}
            photoUrl={current.photoUrl}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Action bar component with buttons for pass, details, like, and undo actions
 * @param props - Component props
 * @param props.onPass - Callback for pass action
 * @param props.onLike - Callback for like action
 * @param props.onDetails - Callback for details action
 * @param props.onUndo - Callback for undo action
 * @param props.canUndo - Whether undo is available
 * @returns JSX element representing the action bar
 */
function ActionBar({
  onPass,
  onLike,
  onDetails,
  onUndo,
  canUndo,
}: {
  onPass: () => void;
  onLike: () => void;
  onDetails: () => void;
  onUndo: () => void;
  canUndo: boolean;
}) {
  return (
    <div className="action-bar">
      <button
        aria-label="Pass"
        onClick={onPass}
        className="action-btn action-btn--pass"
      >
        <X />
      </button>
      <button
        aria-label="Details"
        onClick={onDetails}
        className="action-btn action-btn--details"
      >
        <Plus />
      </button>
      <button
        aria-label="Like"
        onClick={onLike}
        className="action-btn action-btn--like"
      >
        <Heart />
      </button>
      <button
        aria-label="Annuler la dernière action"
        onClick={onUndo}
        disabled={!canUndo}
        className={`action-btn action-btn--undo ${!canUndo ? 'action-btn--disabled' : ''}`}
      >
        <RotateCcw />
      </button>
    </div>
  );
}

/**
 * Full-screen profile details component with swipe-down to close functionality
 * @param props - Component props
 * @param props.onClose - Callback to close the modal
 * @param props.name - Profile name
 * @param props.age - Profile age
 * @param props.bio - Profile bio text
 * @param props.strikeUrl - URL to the strike fund
 * @param props.strikeTitle - Title of the strike fund
 * @param props.photoUrl - URL to the profile photo
 * @returns JSX element representing the full-screen details view
 */
function DetailsModal({
  onClose,
  name,
  age,
  bio,
  strikeUrl,
  strikeTitle,
  photoUrl,
}: {
  onClose: () => void;
  name: string;
  age: number;
  bio: string;
  strikeUrl: string;
  strikeTitle: string;
  photoUrl: string;
}) {
  const controls = useAnimation();
  const swipeDownThreshold = 100;

  /**
   * Handles the end of a drag gesture for swipe-down to close
   * @param _ - Unused event parameter
   * @param info - Pan gesture information containing offset data
   */
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const y = info.offset.y;

    // Swipe down to close
    if (y > swipeDownThreshold) {
      controls
        .start({
          y: window.innerHeight,
          opacity: 0,
          transition: { duration: 0.3, ease: 'easeInOut' },
        })
        .then(() => {
          onClose();
        });
    } else {
      // Return to original position
      controls.start({ y: 0, opacity: 1 });
    }
  };

  return (
    <motion.div
      className="details-fullscreen"
      initial={{ y: window.innerHeight, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: window.innerHeight, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.2 }}
      onDragEnd={handleDragEnd}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: '#121214',
        overflow: 'hidden',
      }}
    >
      {/* Swipe indicator */}
      <div className="swipe-indicator">
        <ArrowDown size={24} />
        <span>Swipe down to go back</span>
      </div>

      {/* Profile image */}
      <div className="details-image-container">
        <img src={photoUrl} alt={name} className="details-image" />
      </div>

      {/* Profile content */}
      <div className="details-content">
        <div className="details-header">
          <h1 className="details-title">
            {name}, {age}
          </h1>
          <button
            onClick={onClose}
            className="details-close-btn"
            aria-label="Close details"
          >
            <X size={24} />
          </button>
        </div>

        <div className="details-body">
          <p className="details-bio">{bio}</p>

          <div className="details-strike-fund">
            <h3>Soutenir la Cause</h3>
            <a
              href={strikeUrl}
              target="_blank"
              rel="noreferrer"
              className="strike-fund-link"
            >
              {strikeTitle}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
