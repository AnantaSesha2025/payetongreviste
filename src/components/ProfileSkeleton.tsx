import './ProfileSkeleton.css';

interface ProfileSkeletonProps {
  className?: string;
}

/**
 * Skeleton component for profile cards during loading
 */
export function ProfileSkeleton({ className = '' }: ProfileSkeletonProps) {
  return (
    <div className={`profile-skeleton ${className}`}>
      <div className="profile-skeleton__image" />
      <div className="profile-skeleton__content">
        <div className="profile-skeleton__name" />
        <div className="profile-skeleton__bio">
          <div className="profile-skeleton__bio-line" />
          <div className="profile-skeleton__bio-line profile-skeleton__bio-line--short" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the swipe deck when loading profiles
 */
export function SwipeDeckSkeleton() {
  return (
    <div className="swipe-deck-skeleton">
      <ProfileSkeleton className="profile-skeleton--current" />
      <ProfileSkeleton className="profile-skeleton--next" />
    </div>
  );
}
