import { NavLink, Route, Routes } from 'react-router-dom'
import DiscoverPage from './pages/DiscoverPage'
import MatchesPage from './pages/MatchesPage'
import ProfilePage from './pages/ProfilePage'
import ActivistSetupPage from './pages/ActivistSetupPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header" />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/activist" element={<ActivistSetupPage />} />
        </Routes>
      </main>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Discover</NavLink>
        <NavLink to="/matches" className={({ isActive }) => isActive ? 'active' : ''}>Matches</NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink>
        <NavLink to="/activist" className={({ isActive }) => isActive ? 'active' : ''}>Activist</NavLink>
      </nav>
    </div>
  )
}

// App only handles layout and routing

export default App
