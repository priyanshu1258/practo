import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/Auth.css'

/**
 * Login page — supports both User (Consultee) and Expert roles.
 * Design matches Homepage.css / Dashboard.css design system exactly:
 *   - Dark background: #000 → #050010
 *   - Primary gradient: #7c3aed → #00d9ff
 *   - Cards: rgba(124,58,237,0.08) with 1px rgba(124,58,237,0.2) border
 *   - Buttons: .btn-primary gradient style
 *   - Font: Segoe UI (global body font)
 */
export default function Login() {
  const navigate = useNavigate()

  const [role, setRole]         = useState('user')      // 'user' | 'expert'
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const isExpert = role === 'expert'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      // ── Replace this block with your real API call ──────────────────────
      // const res  = await fetch('/api/auth/login', {
      //   method:  'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body:    JSON.stringify({ email, password, role }),
      // })
      // const data = await res.json()
      // if (!res.ok) throw new Error(data.error || 'Login failed')
      // localStorage.setItem('token', data.token)
      // localStorage.setItem('role',  data.user.role)
      // ────────────────────────────────────────────────────────────────────

      // Demo navigation
      await new Promise(r => setTimeout(r, 800))   // simulate network
      navigate(isExpert ? '/expert' : '/consultee')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <div className="auth-container">
        {/* Background orbs — same as hero section */}
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />

        <div className="auth-wrapper">
          <div className="auth-card">

            {/* Logo */}
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon">C</div>
              <span className="auth-logo-text">ConsultPro</span>
            </Link>

            {/* Header */}
            <div className="auth-header">
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">
                Sign in to your {isExpert ? 'expert' : ''} account to continue
              </p>
            </div>

            {/* Role switcher */}
            <div className="role-toggle" style={{ marginBottom: '28px' }}>
              <button
                type="button"
                className={`role-toggle-btn ${!isExpert ? 'active-user' : ''}`}
                onClick={() => { setRole('user'); setError('') }}
              >
                👤 I'm a User
              </button>
              <button
                type="button"
                className={`role-toggle-btn ${isExpert ? 'active-expert' : ''}`}
                onClick={() => { setRole('expert'); setError('') }}
              >
                🎓 I'm an Expert
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="auth-error">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Form */}
            <form className="auth-form" onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email address</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">✉️</span>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPass(v => !v)}
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div style={{ textAlign: 'right', marginTop: '-12px', marginBottom: '20px' }}>
                <span className="auth-link" style={{ fontSize: '0.85rem' }}>
                  Forgot password?
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`auth-submit ${isExpert ? 'expert-submit' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing in…' : `Sign In as ${isExpert ? 'Expert' : 'User'}`}
              </button>
            </form>

            {/* Switch to signup */}
            <p className="auth-footer-text">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">Create one free</Link>
            </p>

          </div>
        </div>
      </div>
    </>
  )
}
