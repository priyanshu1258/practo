import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Navbar.css'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">P</span>
          <span className="logo-text">Practo</span>
        </Link>

        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <a href="#features" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
          <a href="#testimonials" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</a>
          <a href="#pricing" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
        </div>

        <div className="navbar-actions">
          <div className="role-buttons">
            <Link to="/expert" className="role-btn expert-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Expert
            </Link>
            <Link to="/consultee" className="role-btn consultee-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Consultee
            </Link>
          </div>

          <div className="auth-buttons">
            <button className="btn-signup" onClick={() => navigate('/Signup')}>Sign Up</button>
          </div>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}
