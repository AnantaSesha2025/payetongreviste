import { NavLink, Route, Routes } from 'react-router-dom';
import { Search, MessageCircle, GitHub } from 'react-feather';
import { useEffect } from 'react';
import DiscoverPage from './pages/DiscoverPage';
import MatchesPage from './pages/MatchesPage';
import ActivistSetupPage from './pages/ActivistSetupPage';
import { GistDemoPage } from './pages/GistDemoPage';
import { ToastContainer } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useToast } from './hooks/useToast';
import { useAppStore } from './store';
import { githubGistService } from './lib/githubGist';
import { DEFAULT_GIST_ID } from './lib/constants';
import { convertGistProfileToAppProfile } from './lib/fakeProfiles';
import { mockProfiles } from './store';
import './App.css';

/**
 * Main App component that handles routing and layout.
 * Provides navigation between the main app sections: Discover and Matches.
 * Activist Setup is accessible via sublink from Discover page.
 *
 * @returns JSX element representing the main app layout
 */
function App() {
  const { toasts, removeToast } = useToast();
  const { profiles, setProfiles } = useAppStore();

  // Initialize profiles from Gist on app startup
  useEffect(() => {
    const initializeProfiles = async () => {
      // Only load if no profiles are already loaded
      if (profiles.length === 0) {
        try {
          // Set the Gist ID
          githubGistService.setGistId(DEFAULT_GIST_ID);

          // Try to load profiles from Gist
          const result = await githubGistService.readProfiles(DEFAULT_GIST_ID);

          if (result.success && result.profiles && result.profiles.length > 0) {
            // Convert Gist profiles to app format
            const appProfiles = result.profiles.map(
              convertGistProfileToAppProfile
            );
            setProfiles(appProfiles);
            console.log('✅ Loaded profiles from Gist:', appProfiles.length);
          } else {
            // Fallback to mock data if Gist is empty or fails
            console.log('⚠️ Gist is empty or failed to load, using mock data');
            setProfiles(mockProfiles);
          }
        } catch (error) {
          // Fallback to mock data on error
          console.error('❌ Error loading from Gist, using mock data:', error);
          setProfiles(mockProfiles);
        }
      }
    };

    initializeProfiles();
  }, [profiles.length, setProfiles]);

  return (
    <ErrorBoundary>
      <div className="app">
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <header className="app-header">
          <h1 className="app-title">PayeTonGréviste</h1>
        </header>
        <main id="main-content" data-testid="main-content" className="app-main">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<DiscoverPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/activist" element={<ActivistSetupPage />} />
              <Route path="/gist-demo" element={<GistDemoPage />} />
              <Route
                path="*"
                element={
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h2>Page Not Found</h2>
                    <p>La page que vous recherchez n'existe pas.</p>
                    <a href={import.meta.env.BASE_URL}>Retour à l'accueil</a>
                  </div>
                }
              />
            </Routes>
          </ErrorBoundary>
        </main>
        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <Search />
            <span>Découvrir des profils</span>
          </NavLink>
          <NavLink
            to="/matches"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <MessageCircle />
            <span>Matches</span>
          </NavLink>
          <NavLink
            to="/gist-demo"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <GitHub />
            <span>Gist Demo</span>
          </NavLink>
        </nav>
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
