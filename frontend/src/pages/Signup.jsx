import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'




import '../styles/Auth.css'

/**
 * Signup page — split-panel layout.
 * Left panel:  role selector + feature benefits (decorative)
 * Right panel: registration form fields (change per role)
 *
 * User role  → pink/rose accent  (matches .consultee-btn)
 * Expert role → indigo accent    (matches .expert-btn)
 *
 * All colors, fonts, animations lifted directly from Homepage.css
 */

const USER_BENEFITS = [
  'Book verified experts instantly',
  'Secure UPI / QR code payments',
  'HD video consultations',
  'Rating & review system',
  'Session reminders via email',
]

const EXPERT_BENEFITS = [
  'Set your own availability & pricing',
  'Get paid directly after sessions',
  'Admin-verified trusted badge',
  'Manage bookings from dashboard',
  'Build your expert reputation',
]

const CATEGORIES = [
  'Medical', 'Legal', 'Finance', 'Mental Health',
  'Career', 'Education', 'Technology', 'Business',
]

export default function Signup() {
  const navigate = useNavigate()

  const [role, setRole]             = useState('user')   // 'user' | 'expert'
  const [showPass, setShowPass]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed]         = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  // Shared fields
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [phone, setPhone]           = useState('')
  const [password, setPassword]     = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  // Expert-only fields
  const [category, setCategory]     = useState('Medical')
  const [specialization, setSpec]   = useState('')
  const [experience, setExp]        = useState('')
  const [price, setPrice]           = useState('')

  const isExpert = role === 'expert'
  const benefits = isExpert ? EXPERT_BENEFITS : USER_BENEFITS

  function validate() {
    if (!name.trim())                       return 'Full name is required.'
    if (!email.trim())                      return 'Email is required.'
    if (!/\S+@\S+\.\S+/.test(email))        return 'Enter a valid email address.'
    if (password.length < 6)               return 'Password must be at least 6 characters.'
    if (password !== confirmPass)          return 'Passwords do not match.'
    if (isExpert && !specialization.trim()) return 'Please enter your specialization.'
    if (isExpert && !price)                return 'Please enter your consultation fee.'
    if (!agreed)                           return 'Please accept the terms & conditions.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    try {
      // ── Replace with your real API call ─────────────────────────────────
      // const payload = {
      //   name, email, phone, password, role,
      //   ...(isExpert && { category, specialization, experience: +experience, price: +price }),
      // }
      // const res  = await fetch('/api/auth/register', {
      //   method:  'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body:    JSON.stringify(payload),
      // })
      // const data = await res.json()
      // if (!res.ok) throw new Error(data.error || 'Registration failed')
      // localStorage.setItem('token', data.token)
      // localStorage.setItem('role',  data.user.role)
      // ─────────────────────────────────────────────────────────────────────

      await new Promise(r => setTimeout(r, 900))   // simulate network
      navigate(isExpert ? '/expert-dashboard' : '/consultee-dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <div className="auth-container">
        {/* Background orbs */}
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />

        <div className="auth-wrapper wide">
          <div className="auth-split">

            {/* ── LEFT PANEL ── */}
            <div className="auth-panel-left">

              {/* Role toggle */}
              <div className="role-toggle" style={{ width: '100%' }}>
                <button
                  type="button"
                  className={`role-toggle-btn ${!isExpert ? 'active-user' : ''}`}
                  onClick={() => { setRole('user'); setError('') }}
                >
                  👤 User
                </button>
                <button
                  type="button"
                  className={`role-toggle-btn ${isExpert ? 'active-expert' : ''}`}
                  onClick={() => { setRole('expert'); setError('') }}
                >
                  🎓 Expert
                </button>
              </div>

              {/* Icon + heading */}
              <div className="panel-icon">
                {isExpert ? '🎓' : '🔍'}
              </div>
              <h2>{isExpert ? 'Join as Expert' : 'Join as User'}</h2>
              <p>
                {isExpert
                  ? 'Share your expertise, set your schedule, and earn by helping people.'
                  : 'Connect with verified professionals for personalized consultations.'}
              </p>

              {/* Benefits */}
              <ul className="auth-benefits">
                {benefits.map(b => (
                  <li key={b}>
                    <span className="benefit-dot" />
                    {b}
                  </li>
                ))}
              </ul>

              {/* Already have account */}
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                Already have an account?{' '}
                <Link to="/Login" className="auth-link">Sign in</Link>
              </p>
            </div>

            {/* ── RIGHT PANEL (form) ── */}
            <div className="auth-panel-right">

              {/* Logo */}
              <Link to="/" className="auth-logo">
                <div className="auth-logo-icon">C</div>
                <span className="auth-logo-text">ConsultPro</span>
              </Link>

              {/* Heading */}
              <div className="auth-header">
                <h1 className="auth-title">
                  {isExpert ? 'Expert Registration' : 'Create Account'}
                </h1>
                <p className="auth-subtitle">
                  {isExpert
                    ? 'Submit your profile for admin verification.'
                    : 'Start exploring experts in minutes.'}
                </p>
              </div>

              {/* Expert notice */}
              {isExpert && (
                <div className="expert-notice">
                  <span className="expert-notice-icon">ℹ️</span>
                  <span>
                    Expert accounts are reviewed by our admin team within 24–48 hours
                    before going live. You'll be notified via email.
                  </span>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="auth-error">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Form */}
              <form className="auth-form" onSubmit={handleSubmit} noValidate>

                {/* Name + Phone */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className="form-input-wrap">
                      <span className="form-input-icon">👤</span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Your full name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <div className="form-input-wrap">
                      <span className="form-input-icon">📱</span>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+91 9876543210"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email Address</label>
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

                {/* Expert-only fields */}
                {isExpert && (
                  <>
                    {/* Category + Specialization */}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <div className="form-input-wrap select-wrap">
                          <span className="form-input-icon">📂</span>
                          <select
                            className="form-select"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                          >
                            {CATEGORIES.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Specialization</label>
                        <div className="form-input-wrap">
                          <span className="form-input-icon">🏷️</span>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Tax Law, MBBS"
                            value={specialization}
                            onChange={e => setSpec(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Experience + Price */}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Years of Experience</label>
                        <div className="form-input-wrap">
                          <span className="form-input-icon">📅</span>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="e.g. 8"
                            min="0"
                            value={experience}
                            onChange={e => setExp(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Consultation Fee (₹)</label>
                        <div className="form-input-wrap">
                          <span className="form-input-icon">💰</span>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="e.g. 800"
                            min="0"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Password + Confirm */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="form-input-wrap">
                      <span className="form-input-icon">🔒</span>
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPass(v => !v)}
                        aria-label="Toggle password"
                      >
                        {showPass ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className="form-input-wrap">
                      <span className="form-input-icon">🔑</span>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Repeat password"
                        value={confirmPass}
                        onChange={e => setConfirmPass(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirm(v => !v)}
                        aria-label="Toggle confirm password"
                      >
                        {showConfirm ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="auth-terms">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                  />
                  <label htmlFor="terms">
                    I agree to the{' '}
                    <span className="auth-link">Terms of Service</span> and{' '}
                    <span className="auth-link">Privacy Policy</span>
                    {isExpert && ', and understand my profile requires admin approval before going live.'}
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={`auth-submit ${isExpert ? 'expert-submit' : ''}`}
                  disabled={loading}
                >
                  {loading
                    ? 'Creating account…'
                    : isExpert
                    ? 'Register as Expert →'
                    : 'Create My Account →'}
                </button>

              </form>
            </div>
            {/* end right panel */}

          </div>
          {/* end auth-split */}
        </div>
      </div>
    </>
  )
}
