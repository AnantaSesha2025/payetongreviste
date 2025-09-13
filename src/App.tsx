import { NavLink, Route, Routes } from 'react-router-dom';
import { Search, MessageCircle, GitHub } from 'react-feather';
import DiscoverPage from './pages/DiscoverPage';
import MatchesPage from './pages/MatchesPage';
import ActivistSetupPage from './pages/ActivistSetupPage';
import { GistDemoPage } from './pages/GistDemoPage';
import { ToastContainer } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useToast } from './hooks/useToast';
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

  return (
    <ErrorBoundary>
      <div className="app">
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <header className="app-header">
          <h1 className="app-title">PayeTonGréviste</h1>
        </header>
        <main id="main-content" className="app-main">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<DiscoverPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/activist" element={<ActivistSetupPage />} />
              <Route path="/gist-demo" element={<GistDemoPage />} />
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
            <span>Découvrir</span>
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
