import { NavLink, Route, Routes } from 'react-router-dom'
import { AssistantPage } from './pages/AssistantPage'
import { OverviewPage } from './pages/OverviewPage'
import { SamplesPage } from './pages/SamplesPage'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-title">R&amp;D Workflow AI Demo Suite</div>
          <div className="brand-subtitle">Role-aligned demos (seeded mock data)</div>
        </div>
        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Overview
          </NavLink>
          <NavLink
            to="/samples"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Samples
          </NavLink>
          <NavLink
            to="/assistant"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Breeding Assistant
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/samples" element={<SamplesPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
