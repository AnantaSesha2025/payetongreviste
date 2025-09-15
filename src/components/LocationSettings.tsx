import { useState, useRef, useEffect } from 'react';
import { MapPin, X, RefreshCw } from 'react-feather';
import './LocationSettings.css';

interface LocationSettingsProps {
  userLocation: { lat: number; lon: number } | null;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  sortByDistance: boolean;
  setSortByDistance: (sort: boolean) => void;
  onRequestLocation: () => void;
  locationRequested: boolean;
  profileCount: number;
  totalProfiles: number;
}

export function LocationSettings({
  userLocation,
  maxDistance,
  setMaxDistance,
  sortByDistance,
  setSortByDistance,
  onRequestLocation,
  locationRequested,
  profileCount,
  totalProfiles,
}: LocationSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const distanceOptions = [10, 25, 50, 100, 200, 500];

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const isUsingDefaultLocation =
    !userLocation ||
    (userLocation.lat === 48.8566 && userLocation.lon === 2.3522);
  const hasRequestedLocation = locationRequested;

  return (
    <>
      {/* Location Settings Button */}
      <button
        ref={buttonRef}
        className="location-settings-btn"
        onClick={handleToggle}
        aria-label="Open location settings"
      >
        <MapPin size={20} />
        <span className="location-settings-text">
          {profileCount}/{totalProfiles}
        </span>
      </button>

      {/* Location Settings Popup */}
      {isOpen && (
        <div className="location-settings-popup" ref={popupRef}>
          <div className="location-settings-header">
            <h3>Location Settings</h3>
            <button
              className="location-settings-close"
              onClick={handleClose}
              aria-label="Close location settings"
            >
              <X size={18} />
            </button>
          </div>

          <div className="location-settings-content">
            {/* Location Status Section */}
            <div className="location-settings-section">
              <label>Your Location</label>
              {!hasRequestedLocation ? (
                <div className="location-request">
                  <p>
                    Enable location to see nearby profiles and get
                    distance-based filtering
                  </p>
                  <button
                    className="location-request-btn"
                    onClick={onRequestLocation}
                    disabled={locationRequested}
                  >
                    {locationRequested ? (
                      <>
                        <RefreshCw size={16} className="spinning" />
                        Requesting...
                      </>
                    ) : (
                      <>
                        <MapPin size={16} />
                        Enable Location
                      </>
                    )}
                  </button>
                </div>
              ) : isUsingDefaultLocation ? (
                <div className="location-request">
                  <p>
                    Using Paris as default location. Enable your location for
                    better results.
                  </p>
                  <button
                    className="location-request-btn"
                    onClick={onRequestLocation}
                    disabled={locationRequested}
                  >
                    {locationRequested ? (
                      <>
                        <RefreshCw size={16} className="spinning" />
                        Requesting...
                      </>
                    ) : (
                      <>
                        <MapPin size={16} />
                        Get My Location
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="location-info">
                  <div className="location-coordinates">
                    <MapPin size={16} />
                    <span>
                      {userLocation.lat.toFixed(4)},{' '}
                      {userLocation.lon.toFixed(4)}
                    </span>
                  </div>
                  <button
                    className="location-refresh-btn"
                    onClick={onRequestLocation}
                  >
                    <RefreshCw size={14} />
                    Refresh
                  </button>
                </div>
              )}
            </div>

            {/* Distance Filter Section */}
            <div className="location-settings-section">
              <label htmlFor="distance-slider">
                Search Radius: {maxDistance}km
              </label>
              <input
                id="distance-slider"
                type="range"
                min="5"
                max="500"
                step="5"
                value={maxDistance}
                onChange={e => setMaxDistance(Number(e.target.value))}
                className="distance-slider"
              />
              <div className="distance-presets">
                {distanceOptions.map(distance => (
                  <button
                    key={distance}
                    className={`distance-preset ${maxDistance === distance ? 'active' : ''}`}
                    onClick={() => setMaxDistance(distance)}
                  >
                    {distance}km
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options Section */}
            <div className="location-settings-section">
              <label className="sort-toggle">
                <input
                  type="checkbox"
                  checked={sortByDistance}
                  onChange={e => setSortByDistance(e.target.checked)}
                />
                Sort by distance (closest first)
              </label>
            </div>

            {/* Profile Count */}
            <div className="location-settings-footer">
              <span className="profile-count">
                Showing {profileCount} of {totalProfiles} profiles
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
