# PayeTonGréviste

A React + TypeScript Strike fund discovery app that uses a Tinder-like interface to help users find and support real Strike funds through fake activist profiles. Users anonymously browse profiles representing different causes, with each profile connected to actual donation pages.

## 🎯 Project Purpose

PayeTonGréviste is **not a real matching app** - it's a gamified way to discover and support Strike funds. Users are anonymous and use the app to find important causes in a fun, engaging way. Each fake profile represents a real cause and connects to actual Strike fund donation pages.

## ✨ Features

- **🎯 Strike Fund Discovery**: Swipe through fake activist profiles to find real Strike funds
- **💳 Real Donation Links**: Each profile connects to actual, verified Strike fund pages
- **👤 Anonymous Users**: No registration required - completely anonymous browsing
- **📱 Mobile-First Design**: Optimized for mobile devices with swipe gestures
- **🌍 Multiple Causes**: Support transport, education, health, environment, and more
- **⚡ Real-Time Updates**: Fund progress and impact tracking
- **🔒 Privacy-First**: No personal data collection or storage

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/paye-ton-greviste.git
cd paye-ton-greviste

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser
# Navigate to http://localhost:3000
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
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

## 🎮 How to Use

### For Users (Anonymous)

1. **Open the app** - No registration required
2. **Swipe through profiles** - Right to like, left to pass, up for details
3. **Discover Strike funds** - Each profile connects to real donation pages
4. **Support causes** - Click fund links to donate directly

### For Contributors

1. **Fork the repository** - Create your own copy
2. **Add Strike funds** - Submit new funds via GitHub issues
3. **Improve profiles** - Create more diverse fake activist profiles
4. **Enhance features** - Add new functionality and improvements

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

### Areas for Contribution

- **Strike Fund Integration**: Add new verified Strike funds
- **Profile Diversity**: Create more diverse fake activist profiles
- **Accessibility**: Improve screen reader support
- **Mobile Experience**: Enhance mobile usability
- **Testing**: Increase test coverage
- **Documentation**: Improve code documentation

## 📚 Documentation

- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project
- [Development Guide](DEVELOPMENT.md) - Detailed development setup and architecture
- [API Documentation](API.md) - Internal APIs and data structures
- [Deployment Guide](DEPLOYMENT.md) - How to deploy the app
- [TODO List](TODO.md) - Development roadmap and tasks

## 🔒 Privacy & Security

- **Anonymous Users**: No registration or personal data collection
- **No Data Persistence**: No localStorage or user data storage
- **Verified Funds**: All Strike funds are verified and legitimate
- **Privacy-First Design**: Complete anonymity for users
- **Secure Links**: All fund links are verified and safe
- **Google Boycott**: We avoid Google services in solidarity with the strike movement

## 🏗️ Development

The app uses a mobile-first approach with:

- Bottom navigation on mobile
- Top navigation on desktop (768px+)
- Fixed positioning to prevent scrolling on Discover page
- Responsive breakpoints: 320px, 640px, 768px, 1024px

## 📊 Strike Fund Database

The app includes a real database of verified Strike funds:

- **Transport Workers**: Metro, bus, and rail workers
- **Education**: Teachers and education workers
- **Healthcare**: Nurses and healthcare workers
- **Environment**: Climate and environmental causes
- **Food Service**: Restaurant and food workers
- **And more**: Various other social causes

## 🚀 Deployment

The app can be deployed to:

- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**

See [Deployment Guide](DEPLOYMENT.md) for detailed instructions.

## 📄 License

This project is for educational/activist purposes. By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Acknowledgments

- All Strike fund organizers and workers
- The open source community
- Contributors and supporters

---

**Together, we can help people discover and support important Strike funds! 🚀**