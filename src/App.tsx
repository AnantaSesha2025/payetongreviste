import { NavLink, Route, Routes } from 'react-router-dom'
import { Search, MessageCircle } from 'react-feather'
import DiscoverPage from './pages/DiscoverPage'
import MatchesPage from './pages/MatchesPage'
import ActivistSetupPage from './pages/ActivistSetupPage'
import { ToastContainer, useToast } from './components/Toast'
import './App.css'

/**
 * Main App component that handles routing and layout.
 * Provides navigation between the main app sections: Discover and Matches.
 * Activist Setup is accessible via sublink from Discover page.
 * 
 * @returns JSX element representing the main app layout
 */
function App() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">PayeTonGréviste</h1>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/activist" element={<ActivistSetupPage />} />
        </Routes>
      </main>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          <Search />
          <span>Découvrir</span>
        </NavLink>
        <NavLink to="/matches" className={({ isActive }) => isActive ? 'active' : ''}>
          <MessageCircle />
          <span>Matches</span>
        </NavLink>
      </nav>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export default App
