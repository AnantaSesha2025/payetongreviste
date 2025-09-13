# Paye ton Gréviste

A React + TypeScript app that mimics Tinder's swipe interface for activist profiles. Users swipe through fake profiles created by activists, with each profile linking to strike funds.

## Features

- **Swipe Interface**: Swipe right to like, left to pass, up for details
- **Geolocation**: Shows profiles within 50km radius (currently disabled due to bugs)
- **Matches**: Chat with liked profiles, with strike fund links
- **Activist Setup**: Create/edit fake profiles with AI generation placeholder
- **Responsive Design**: Mobile-first with bottom navigation

## Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Framer Motion (animations)
- Zustand (state management)
- React Router (routing)
- React Feather (icons)

## Theme

- **Colors**: Black background (#121214), yellow primary (#F9E25B), white text
- **Typography**: Inter font, uppercase titles, bold CTAs
- **Layout**: Mobile-first, 420px max width, edge-to-edge cards
- **Animations**: Smooth swipe with bounce, 300ms transitions

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Card.tsx           # Swipeable profile card
│   ├── SwipeDeck.tsx      # Card stack with actions
│   └── BioWithFund.tsx    # Bio with last word as fund link
├── pages/
│   ├── DiscoverPage.tsx   # Main swipe interface
│   ├── MatchesPage.tsx    # Chat with matches
│   ├── ProfilePage.tsx    # User profile (placeholder)
│   └── ActivistSetupPage.tsx # Create/edit fake profiles
├── lib/
│   └── geo.ts             # Geolocation utilities
├── store.ts               # Zustand state management
├── App.tsx                # Main app with routing
└── index.css              # Global styles
```

## Usage

### For Consumers
1. Open the app and allow location access (optional)
2. Swipe through profiles: right to like, left to pass, up for details
3. View matches and chat (redirects to strike funds)

### For Activists
1. Go to "Activist Setup" page
2. Create new profiles or edit existing ones
3. Use "Generate with AI" for placeholder content
4. Set strike fund URL and title
5. The last word of the bio becomes a clickable fund link

## Privacy

- No consumer data is persisted (no localStorage)
- Only fake profiles and strike fund info are stored in app state
- Geolocation is requested but not saved

## Development

The app uses a mobile-first approach with:
- Bottom navigation on mobile
- Top navigation on desktop (768px+)
- Fixed positioning to prevent scrolling on Discover page
- Responsive breakpoints: 320px, 640px, 768px, 1024px

## License

This project is for educational/activist purposes.