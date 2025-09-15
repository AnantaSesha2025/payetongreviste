import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SwipeDeck } from '../components/SwipeDeck';
import { OnboardingFlow } from '../components/OnboardingFlow';
import { LocationSettings } from '../components/LocationSettings';
import { useAppStore } from '../store';
import './DiscoverPage.css';

/**
 * Main discover page component that displays the swipe interface.
 * Prevents body scrolling to maintain a mobile app-like experience.
 *
 * @returns JSX element representing the discover page
 */
export default function DiscoverPage() {
  const navigate = useNavigate();
  const { profiles } = useAppStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(
    localStorage.getItem('hasSeenOnboarding') === 'true'
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [locationRequested, setLocationRequested] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50);
  const [sortByDistance, setSortByDistance] = useState(true);
  const [hasSetDefaultLocation, setHasSetDefaultLocation] = useState(false);

  // Prevent body scrolling to maintain mobile app feel
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Show onboarding for first-time users
  useEffect(() => {
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, [hasSeenOnboarding]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleCreateProfile = () => {
    navigate('/activist');
  };

  // Location request function
  const handleRequestLocation = () => {
    console.log('=== LOCATION REQUEST STARTED ===');
    console.log('Navigator geolocation available:', !!navigator.geolocation);
    console.log('Current user location:', userLocation);
    console.log('Location requested before:', locationRequested);

    if (!navigator.geolocation) {
      console.log('Geolocation not supported, using Paris as default');
      setUserLocation({ lat: 48.8566, lon: 2.3522 });
      setLocationRequested(true);
      setHasSetDefaultLocation(true);
      return;
    }

    console.log('Requesting user location...');
    setLocationRequested(true);

    navigator.geolocation.getCurrentPosition(
      position => {
        console.log('=== LOCATION SUCCESS ===');
        console.log('Position obtained:', position);
        console.log('Coordinates:', position.coords);
        console.log('Accuracy:', position.coords.accuracy);
        console.log('Timestamp:', new Date(position.timestamp));

        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setUserLocation(location);
        setHasSetDefaultLocation(false);
        console.log('Location state updated:', location);
      },
      error => {
        console.log('=== LOCATION ERROR ===');
        console.error('Error getting location:', error);
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);

        if (error.code === 1) {
          console.log('PERMISSION_DENIED - User denied location access');
        } else if (error.code === 2) {
          console.log('POSITION_UNAVAILABLE - Location unavailable');
        } else if (error.code === 3) {
          console.log('TIMEOUT - Location request timed out');
        }

        console.log('Falling back to Paris as default location');
        setUserLocation({ lat: 48.8566, lon: 2.3522 });
        setHasSetDefaultLocation(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  // Set default location only when we need it for filtering
  useEffect(() => {
    if (!userLocation && !hasSetDefaultLocation) {
      // Only set default location when we need to show profiles
      // This allows the user to see the location request button first
      setUserLocation({ lat: 48.8566, lon: 2.3522 });
      setHasSetDefaultLocation(true);
    }
  }, [userLocation, hasSetDefaultLocation]);

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="discover">
      <div className="discover-header">
        <h1>Découvrir les Activistes</h1>
        <LocationSettings
          userLocation={userLocation}
          maxDistance={maxDistance}
          setMaxDistance={setMaxDistance}
          sortByDistance={sortByDistance}
          setSortByDistance={setSortByDistance}
          onRequestLocation={handleRequestLocation}
          locationRequested={locationRequested}
          profileCount={profiles.length}
          totalProfiles={profiles.length}
        />
      </div>
      <SwipeDeck
        onCreateProfile={handleCreateProfile}
        userLocation={userLocation}
        maxDistance={maxDistance}
        sortByDistance={sortByDistance}
      />
    </div>
  );
}
