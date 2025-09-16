# API Documentation - PayeTonGréviste

This document describes the internal APIs and data structures used in the PayeTonGréviste Strike fund discovery app.

> **⚠️ Important**: This project boycotts Google services in solidarity with the strike movement. We do not use Google Analytics, Google Fonts, or any other Google services.

## 📋 Table of Contents

- [Data Structures](#data-structures)
- [State Management API](#state-management-api)
- [Strike Fund API](#strike-fund-api)
- [Component APIs](#component-apis)
- [Utility Functions](#utility-functions)
- [Event System](#event-system)

## 🏗️ Data Structures

### Profile Interface

```typescript
interface Profile {
  id: string; // Unique identifier
  name: string; // Display name
  age: number; // Age
  bio: string; // Bio text
  photoUrl: string; // Profile photo URL
  location: { lat: number; lon: number }; // Geographic coordinates
  strikeFund: {
    // Connected Strike fund
    url: string; // Fund donation URL
    title: string; // Fund title
  };
}
```

### Strike Fund Interface

```typescript
interface StrikeFund {
  id: string; // Unique identifier
  title: string; // Fund title
  description: string; // Fund description
  url: string; // Donation URL
  category: FundCategory; // Fund category
  status: FundStatus; // Fund status
  targetAmount: number; // Target amount (€)
  currentAmount: number; // Current amount raised (€)
  urgency: UrgencyLevel; // Urgency level
  location: string; // Fund location
  organizer: string; // Fund organizer
  createdAt: Date; // Creation date
  expiresAt: Date | null; // Expiration date
  isVerified: boolean; // Verification status
  tags: string[]; // Fund tags
  imageUrl: string; // Fund image URL
  impactStories: ImpactStory[]; // Impact stories
}
```

### Fund Categories

```typescript
type FundCategory =
  | 'transport' // Transport workers
  | 'education' // Teachers, students
  | 'health' // Healthcare workers
  | 'environment' // Environmental causes
  | 'social' // Social workers
  | 'culture' // Cultural workers
  | 'food' // Food service workers
  | 'retail' // Retail workers
  | 'tech' // Tech workers
  | 'other'; // Other causes
```

### Fund Status

```typescript
type FundStatus =
  | 'active' // Fund is actively raising money
  | 'paused' // Fund is temporarily paused
  | 'completed' // Fund has reached its goal
  | 'expired' // Fund has expired
  | 'cancelled'; // Fund was cancelled
```

### Urgency Levels

```typescript
type UrgencyLevel =
  | 'low' // No immediate urgency
  | 'medium' // Some urgency
  | 'high' // High urgency
  | 'critical'; // Critical urgency
```

## 🗄️ State Management API

### Zustand Store

The app uses Zustand for state management. Access the store with:

```typescript
import { useAppStore } from './store';

// Get the entire store
const store = useAppStore();

// Get specific state
const { profiles, likedIds, chats } = useAppStore();
```

### Store State

```typescript
type AppState = {
  // Data
  profiles: Profile[]; // All profiles
  likedIds: Set<string>; // Liked profile IDs
  passedIds: Set<string>; // Passed profile IDs
  chats: Record<string, ChatMessage[]>; // Chat messages by profile ID
  currentUser: Profile | null; // Current user profile

  // Actions
  likeProfile: (id: string) => void; // Like a profile
  passProfile: (id: string) => void; // Pass on a profile
  setProfiles: (profiles: Profile[]) => void; // Set all profiles
  ensureChatFor: (id: string) => void; // Ensure chat exists
  addUserMessage: (id: string, text: string) => void; // Add user message
  upsertProfile: (profile: Profile) => void; // Create/update profile
  removeProfile: (id: string) => void; // Remove profile
  updateUserProfile: (profile: Profile) => void; // Update user profile
  deleteUserProfile: () => void; // Delete user profile
  isProfileComplete: () => boolean; // Check profile completeness
};
```

### Store Actions

#### likeProfile(id: string)

Likes a profile and creates a chat with Strike fund information.

```typescript
const { likeProfile } = useAppStore();

// Like a profile
likeProfile('profile-123');
```

#### passProfile(id: string)

Passes on a profile (adds to passed set).

```typescript
const { passProfile } = useAppStore();

// Pass on a profile
passProfile('profile-123');
```

#### setProfiles(profiles: Profile[])

Sets all profiles in the store.

```typescript
const { setProfiles } = useAppStore();

// Set profiles
setProfiles(mockProfiles);
```

#### ensureChatFor(id: string)

Ensures a chat exists for a profile with default Strike fund message.

```typescript
const { ensureChatFor } = useAppStore();

// Ensure chat exists
ensureChatFor('profile-123');
```

#### addUserMessage(id: string, text: string)

Adds a user message to a chat.

```typescript
const { addUserMessage } = useAppStore();

// Add user message
addUserMessage('profile-123', 'Hello!');
```

## 🎯 Strike Fund API

### Import Strike Fund Functions

```typescript
import {
  getActiveFunds,
  getFundsByCategory,
  getFundsByUrgency,
  getFundsByLocation,
  searchFunds,
  getFundById,
  getFundsSortedByPriority,
  getFundProgress,
  isFundUrgent,
  getUrgentFunds,
  getFundStats,
} from './lib/strikeFunds';
```

### Fund Retrieval Functions

#### getActiveFunds()

Returns all active Strike funds.

```typescript
const activeFunds = getActiveFunds();
// Returns: StrikeFund[]
```

#### getFundsByCategory(category: FundCategory)

Returns funds filtered by category.

```typescript
const transportFunds = getFundsByCategory('transport');
// Returns: StrikeFund[]
```

#### getFundsByUrgency(urgency: UrgencyLevel)

Returns funds filtered by urgency level.

```typescript
const urgentFunds = getFundsByUrgency('critical');
// Returns: StrikeFund[]
```

#### getFundsByLocation(location: string)

Returns funds filtered by location.

```typescript
const parisFunds = getFundsByLocation('Paris');
// Returns: StrikeFund[]
```

#### searchFunds(query: string)

Searches funds by title, description, tags, or organizer.

```typescript
const results = searchFunds('transport');
// Returns: StrikeFund[]
```

#### getFundById(id: string)

Returns a specific fund by ID.

```typescript
const fund = getFundById('fund-001');
// Returns: StrikeFund | undefined
```

### Fund Analysis Functions

#### getFundsSortedByPriority()

Returns funds sorted by urgency and progress.

```typescript
const prioritizedFunds = getFundsSortedByPriority();
// Returns: StrikeFund[] (sorted)
```

#### getFundProgress(fund: StrikeFund)

Returns fund progress as percentage.

```typescript
const progress = getFundProgress(fund);
// Returns: number (0-100)
```

#### isFundUrgent(fund: StrikeFund)

Checks if fund is urgent.

```typescript
const urgent = isFundUrgent(fund);
// Returns: boolean
```

#### getUrgentFunds()

Returns all urgent funds.

```typescript
const urgentFunds = getUrgentFunds();
// Returns: StrikeFund[]
```

#### getFundStats()

Returns fund statistics.

```typescript
const stats = getFundStats();
// Returns: {
//   totalFunds: number,
//   totalTarget: number,
//   totalRaised: number,
//   averageProgress: number,
//   urgentFunds: number,
//   categories: number
// }
```

## 🧩 Component APIs

### SwipeDeck Component

```typescript
interface SwipeDeckProps {
  onCreateProfile: () => void    // Callback for profile creation
}

// Usage
<SwipeDeck onCreateProfile={handleCreateProfile} />
```

### Card Component

```typescript
interface CardProps {
  profile: Profile              // Profile to display
  onSwipe: (direction: 'left' | 'right' | 'up') => void  // Swipe callback
  style?: React.CSSProperties  // Custom styles
}

// Usage
<Card
  profile={profile}
  onSwipe={handleSwipe}
  style={{ zIndex: 10 }}
/>
```

### Toast Component

```typescript
interface ToastProps {
  toasts: Toast[]               // Array of toasts
  onClose: (id: string) => void // Close callback
}

interface Toast {
  id: string                    // Toast ID
  message: string               // Toast message
  type: 'success' | 'error' | 'info' | 'warning'  // Toast type
  duration?: number             // Duration in ms
}

// Usage
<ToastContainer toasts={toasts} onClose={removeToast} />
```

### OnboardingFlow Component

```typescript
interface OnboardingFlowProps {
  onComplete: () => void        // Completion callback
}

// Usage
<OnboardingFlow onComplete={handleOnboardingComplete} />
```

## 🛠️ Utility Functions

### Geolocation Utilities

```typescript
import { haversineKm, getCurrentLocation } from './lib/geo';

// Calculate distance between two points
const distance = haversineKm(lat1, lon1, lat2, lon2);
// Returns: number (distance in km)

// Get current location
const location = await getCurrentLocation();
// Returns: { lat: number, lon: number } | null
```

### Toast Utilities

```typescript
import { useToast } from './components/Toast';

const { showSuccess, showError, showInfo, showWarning } = useToast();

// Show success toast
showSuccess('Success!', 'Operation completed successfully');

// Show error toast
showError('Error!', 'Something went wrong');

// Show info toast
showInfo('Info', 'Here is some information');

// Show warning toast
showWarning('Warning!', 'Please be careful');
```

## 📡 Event System

### Swipe Events

The app handles swipe gestures through Framer Motion:

```typescript
// Swipe direction types
type SwipeDirection = 'left' | 'right' | 'up';

// Swipe event handler
const handleSwipe = (direction: SwipeDirection) => {
  switch (direction) {
    case 'left':
      passProfile(currentProfile.id);
      break;
    case 'right':
      likeProfile(currentProfile.id);
      break;
    case 'up':
      showProfileDetails(currentProfile);
      break;
  }
};
```

### Navigation Events

```typescript
// Navigation routes
const routes = {
  '/': 'DiscoverPage',
  '/matches': 'MatchesPage',
  '/activist': 'ActivistSetupPage',
};

// Navigation handler
const navigate = useNavigate();
navigate('/matches');
```

## 🔧 Configuration

### Environment Variables

```bash
# Development Configuration
VITE_APP_TITLE=PayeTonGréviste
VITE_APP_VERSION=0.0.0
VITE_APP_ENV=development

# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=5000

# Feature Flags
VITE_ENABLE_GEOLOCATION=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true

# Strike Fund Configuration
VITE_DEFAULT_FUND_CATEGORIES=transport,education,health,environment
VITE_MAX_PROFILES_PER_LOAD=10
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 🧪 Testing APIs

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from './Card'

test('renders profile information', () => {
  const profile = mockProfiles[0]
  render(<Card profile={profile} onSwipe={jest.fn()} />)

  expect(screen.getByText(profile.name)).toBeInTheDocument()
  expect(screen.getByText(profile.bio)).toBeInTheDocument()
})
```

### Store Testing

```typescript
import { useAppStore } from './store';

test('likes profile and creates chat', () => {
  const { likeProfile, chats } = useAppStore.getState();

  likeProfile('profile-1');

  expect(chats['profile-1']).toBeDefined();
  expect(chats['profile-1'][0].from).toBe('bot');
});
```

## 📚 Examples

### Complete Profile Creation Flow

```typescript
import { useAppStore } from './store'
import { getActiveFunds } from './lib/strikeFunds'

function CreateProfile() {
  const { upsertProfile } = useAppStore()
  const funds = getActiveFunds()

  const handleCreateProfile = (profileData) => {
    // Select a random fund
    const randomFund = funds[Math.floor(Math.random() * funds.length)]

    const profile = {
      id: generateId(),
      name: profileData.name,
      age: profileData.age,
      bio: profileData.bio,
      photoUrl: profileData.photoUrl,
      location: profileData.location,
      strikeFund: {
        url: randomFund.url,
        title: randomFund.title
      }
    }

    upsertProfile(profile)
  }

  return (
    <form onSubmit={handleCreateProfile}>
      {/* Form fields */}
    </form>
  )
}
```

### Fund Discovery with Filtering

```typescript
import { getFundsByCategory, getUrgentFunds, searchFunds } from './lib/strikeFunds'

function FundDiscovery() {
  const [category, setCategory] = useState<FundCategory>('transport')
  const [searchQuery, setSearchQuery] = useState('')

  const funds = useMemo(() => {
    if (searchQuery) {
      return searchFunds(searchQuery)
    }
    return getFundsByCategory(category)
  }, [category, searchQuery])

  const urgentFunds = getUrgentFunds()

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search funds..."
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="transport">Transport</option>
        <option value="education">Education</option>
        <option value="health">Health</option>
      </select>

      {urgentFunds.length > 0 && (
        <div className="urgent-funds">
          <h3>Urgent Funds</h3>
          {urgentFunds.map(fund => (
            <FundCard key={fund.id} fund={fund} />
          ))}
        </div>
      )}

      <div className="funds-list">
        {funds.map(fund => (
          <FundCard key={fund.id} fund={fund} />
        ))}
      </div>
    </div>
  )
}
```

---

This API documentation should help developers understand how to work with the PayeTonGréviste codebase. For more specific examples or questions, please refer to the source code or open an issue.
