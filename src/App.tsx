import { NavLink, Route, Routes } from 'react-router-dom'
import DiscoverPage from './pages/DiscoverPage'
import MatchesPage from './pages/MatchesPage'
import ActivistSetupPage from './pages/ActivistSetupPage'
import './App.css'

/**
 * Main App component that handles routing and layout.
 * Provides navigation between the main app sections: Discover and Matches.
 * Activist Setup is accessible via sublink from Discover page.
 * 
 * @returns JSX element representing the main app layout
 */
function App() {
  return (
    <div className="app">
      <header className="app-header" />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/activist" element={<ActivistSetupPage />} />
        </Routes>
      </main>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Discover</NavLink>
        <NavLink to="/matches" className={({ isActive }) => isActive ? 'active' : ''}>Matches</NavLink>
      </nav>
    </div>
  )
}

export default App
