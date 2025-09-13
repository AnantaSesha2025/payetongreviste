# Development Guide - PayeTonGréviste

This guide provides detailed instructions for setting up and developing the PayeTonGréviste Strike fund discovery app.

> **⚠️ Important**: This project boycotts Google services in solidarity with the strike movement. We do not use Google Analytics, Google Fonts, or any other Google services. Please avoid suggesting Google-based solutions.

## 🏗️ Architecture Overview

PayeTonGréviste is a React + TypeScript web application that uses a Tinder-like interface to help users discover Strike funds through fake activist profiles.

### Core Concepts

- **Fake Profiles**: Generated activist profiles that represent different causes
- **Strike Funds**: Real donation links connected to each fake profile
- **Anonymous Users**: No user registration or personal data collection
- **Gamified Discovery**: Swipe interface makes fund discovery engaging

### Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Routing**: React Router
- **Animations**: Framer Motion
- **Icons**: React Feather
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint + TypeScript ESLint

## 🚀 Development Setup

### Prerequisites

1. **Node.js 18+**

   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

2. **npm 9+**

   ```bash
   npm --version  # Should be 9.0.0 or higher
   ```

3. **Git**
   ```bash
   git --version
   ```

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/paye-ton-greviste.git
   cd paye-ton-greviste
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Environment Configuration

Create a `.env.local` file for local development:

```env
# Development Configuration
VITE_APP_TITLE=PayeTonGréviste
VITE_APP_VERSION=0.0.0
VITE_APP_ENV=development

# API Configuration (for future backend integration)
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

## 🏛️ Project Structure

```
paye-ton-greviste/
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── __tests__/     # Component tests
│   │   ├── Card.tsx       # Swipeable profile card
│   │   ├── Card.css       # Card styles
│   │   ├── SwipeDeck.tsx  # Card stack with actions
│   │   ├── SwipeDeck.css  # Swipe deck styles
│   │   ├── BioWithFund.tsx # Bio with fund link
│   │   ├── Toast.tsx      # Toast notifications
│   │   ├── Toast.css      # Toast styles
│   │   ├── OnboardingFlow.tsx # First-time user flow
│   │   ├── OnboardingFlow.css
│   │   ├── EnhancedEmptyState.tsx # Empty state component
│   │   ├── EnhancedEmptyState.css
│   │   ├── LoadingSpinner.tsx # Loading indicator
│   │   ├── LoadingSpinner.css
│   │   ├── UserProfileSetup.tsx # Profile creation
│   │   ├── UserProfileSetup.css
│   │   ├── GestureRecognizer.tsx # Touch gesture handling
│   │   └── GestureRecognizer.css
│   ├── pages/             # Page components
│   │   ├── __tests__/     # Page tests
│   │   ├── DiscoverPage.tsx # Main swipe interface
│   │   ├── DiscoverPage.css
│   │   ├── MatchesPage.tsx # Chat with matches
│   │   ├── MatchesPage.css
│   │   ├── ActivistSetupPage.tsx # Profile management
│   │   └── ProfilePage.tsx # User profile (placeholder)
│   ├── lib/               # Utility functions
│   │   └── geo.ts         # Geolocation utilities
│   ├── store.ts           # Zustand state management
│   ├── styles/            # Global styles
│   │   └── design-system.css
│   ├── test/              # Test configuration
│   │   └── setup.ts       # Test setup
│   ├── App.tsx            # Main app component
│   ├── App.css            # App styles
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── dist/                  # Production build
├── node_modules/          # Dependencies
├── .gitignore             # Git ignore rules
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
├── CONTRIBUTING.md        # Contribution guidelines
├── DEVELOPMENT.md         # This file
├── README.md              # Project documentation
├── TODO.md                # Development roadmap
├── package.json           # Project dependencies
├── package-lock.json      # Dependency lock file
├── tsconfig.json          # TypeScript configuration
├── tsconfig.app.json      # App TypeScript config
├── tsconfig.node.json     # Node TypeScript config
├── tsconfig.test.json     # Test TypeScript config
├── vite.config.ts         # Vite configuration
├── vitest.config.ts       # Vitest configuration
└── eslint.config.js       # ESLint configuration
```

## 🧩 Component Architecture

### Component Hierarchy

```
App
├── DiscoverPage
│   ├── OnboardingFlow (conditional)
│   └── SwipeDeck
│       ├── Card (current profile)
│       ├── Card (next profile preview)
│       └── EnhancedEmptyState (when no profiles)
├── MatchesPage
│   └── Chat interface
└── ActivistSetupPage
    └── UserProfileSetup
```

### State Management

The app uses Zustand for state management with the following structure:

```typescript
type AppState = {
  // Core data
  profiles: Profile[]; // All fake profiles
  likedIds: Set<string>; // Liked profile IDs
  passedIds: Set<string>; // Passed profile IDs
  chats: Record<string, ChatMessage[]>; // Chat messages by profile ID
  currentUser: Profile | null; // Current user profile

  // Actions
  likeProfile: (id: string) => void;
  passProfile: (id: string) => void;
  setProfiles: (profiles: Profile[]) => void;
  // ... more actions
};
```

### Data Flow

1. **Profile Loading**: Mock profiles loaded on app start
2. **User Interaction**: Swipe/click actions update state
3. **Chat Creation**: Like action creates chat with fund link
4. **State Persistence**: Currently in-memory only (TODO: add persistence)

## 🎨 Styling System

### CSS Architecture

- **Global Styles**: `index.css` and `App.css`
- **Component Styles**: Co-located `.css` files
- **Design System**: `styles/design-system.css`
- **CSS Custom Properties**: For theming and consistency

### Design Tokens

```css
:root {
  /* Colors */
  --color-bg-primary: #121214;
  --color-bg-secondary: #1a1a1c;
  --color-primary: #f9e25b;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a0a0a0;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  /* Layout */
  --max-width: 420px;
  --border-radius: 12px;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Responsive Design

- **Mobile First**: Base styles for mobile devices
- **Breakpoints**: 320px, 640px, 768px, 1024px
- **Container**: Max width 420px for mobile app feel
- **Navigation**: Bottom nav on mobile, top nav on desktop

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**: Individual component testing
2. **Integration Tests**: Component interaction testing
3. **E2E Tests**: Full user flow testing (planned)

### Test Structure

```typescript
// Component test example
describe('Card Component', () => {
  it('should render profile information', () => {
    const profile = mockProfiles[0]
    render(<Card profile={profile} />)

    expect(screen.getByText(profile.name)).toBeInTheDocument()
    expect(screen.getByText(profile.bio)).toBeInTheDocument()
  })

  it('should handle swipe gestures', () => {
    // Test swipe functionality
  })
})
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## 🔧 Development Tools

### VS Code Extensions

- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**
- **Prettier - Code formatter**
- **ESLint**

### Recommended Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Browser DevTools

- **React Developer Tools**
- **Zustand DevTools** (for state debugging)
- **Network tab** (for API calls)
- **Console** (for debugging)

## 🐛 Debugging

### Common Issues

1. **Port already in use**

   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   # Or change port in vite.config.ts
   ```

2. **TypeScript errors**

   ```bash
   # Check TypeScript compilation
   npx tsc --noEmit
   ```

3. **Test failures**

   ```bash
   # Run tests with verbose output
   npm run test -- --verbose
   ```

4. **Build errors**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules dist
   npm install
   npm run build
   ```

### Debugging State

```typescript
// Add to components for state debugging
import { useAppStore } from '../store';

function MyComponent() {
  const state = useAppStore();
  console.log('Current state:', state);
  // ... component logic
}
```

## 🚀 Building for Production

### Build Process

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Output

- **dist/**: Production build files
- **dist/index.html**: Main HTML file
- **dist/assets/**: Bundled CSS and JS files

### Environment Variables

```bash
# Production environment variables
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.payetongreviste.com
VITE_ENABLE_ANALYTICS=true
```

## 📦 Deployment

### Static Hosting (Recommended)

- **Vercel**: Easy deployment with GitHub integration
- **Netlify**: Drag and drop deployment
- **GitHub Pages**: Free hosting for public repos

### Deployment Steps

1. **Build the project**: `npm run build`
2. **Upload dist/ folder** to hosting service
3. **Configure environment variables**
4. **Set up custom domain** (optional)

## 🔄 Continuous Integration

### GitHub Actions (Planned)

```yaml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test
      - run: npm run build
```

## 📚 Additional Resources

### Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Vite Guide](https://vitejs.dev/guide/)

### Community

- [React Community](https://react.dev/community)
- [TypeScript Community](https://www.typescriptlang.org/community)
- [GitHub Discussions](https://github.com/your-username/paye-ton-greviste/discussions)

---

This guide should help you get started with development. If you have questions or need help, please open an issue or start a discussion!
