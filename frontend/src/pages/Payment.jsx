/**
 * Payment.jsx
 * ─────────────────────────────────────────────────────────────────
 * Theme  : Light blue / teal — matches updated Homepage.css
 *          Gradient: #0084ff → #00bcd4 → #26a69a
 *
 * Features:
 *  • Hero banner with progress steps (Book → Pay → Confirm)
 *  • Left column  : Booking summary card + admin QR code + UPI ID
 *  • Right column : UTR input + validation + submit + security badges
 *  • 10-minute payment countdown timer
 *  • Copy UPI ID to clipboard
 *  • UTR format validation (12-digit number)
 *  • Loading state on submit
 *  • Success screen with video link after confirmation
 *  • "How to Pay" step guide
 *
 * Usage (in App.jsx):
 *   <Route path="/payment" element={<Payment />} />
 *
 * Pass booking data via react-router state:
 *   navigate('/payment', { state: { booking, expert } })
 *
 * Or the component uses realistic mock data if no state is passed.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/Payment.css'

// ── Constants ────────────────────────────────────────────────
const ADMIN_UPI    = 'adminupi@oksbi'
const QR_IMAGE_SRC = '/qr.jpeg'          // put qr.jpeg in /public folder
const TIMER_SECS   = 10 * 60             // 10-minute payment window

// ── Helpers ──────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0') }

/** UTR / transaction reference: 12-digit numeric string */
function isValidUTR(val) { return /^\d{12}$/.test(val.trim()) }

function generateVideoLink(bookingId) {
  return `https://meet.jit.si/consultpro-${bookingId}-${Math.random().toString(36).slice(2, 8)}`
}

// ── Mock data (used when no router state is passed) ──────────
const MOCK_BOOKING = {
  id:         'BK' + Date.now(),
  date:       '2026-04-02',
  time:       '10:00',
  duration:   60,
  status:     'pending',
  createdAt:  new Date().toLocaleString('en-IN'),
}

const MOCK_EXPERT = {
  name:           'Dr. Priya Sharma',
  initials:       'PS',
  specialization: 'General Physician',
  category:       'Medical',
  experience:     15,
  price:          800,
  rating:         4.9,
  totalReviews:   312,
}

// ── Sub-components ───────────────────────────────────────────

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`pay-toast toast-${type}`}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span style={{ flex: 1 }}>{msg}</span>
      <span style={{ cursor: 'pointer', opacity: 0.7 }} onClick={onClose}>✕</span>
    </div>
  )
}

/** Countdown timer — 10 minutes */
function CountdownTimer({ onExpire }) {
  const [secs, setSecs] = useState(TIMER_SECS)

  useEffect(() => {
    if (secs <= 0) { onExpire(); return }
    const t = setInterval(() => setSecs(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [secs])

  const m = Math.floor(secs / 60)
  const s = secs % 60
  const urgent = secs < 120

  return (
    <div className={`payment-timer ${urgent ? 'timer-urgent' : ''}`}>
      <span>⏱️</span>
      <span>Complete payment within</span>
      <span className="timer-digits">{pad(m)}:{pad(s)}</span>
    </div>
  )
}

/** Stars display */
function Stars({ rating }) {
  const full  = Math.floor(rating)
  const empty = 5 - full
  return (
    <span style={{ color: '#ffa726', fontSize: '0.85rem', letterSpacing: 1 }}>
      {'★'.repeat(full)}{'☆'.repeat(empty)}
    </span>
  )
}

// ── Success Screen ───────────────────────────────────────────
function SuccessScreen({ booking, expert, utr, videoLink, navigate }) {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard?.writeText(videoLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="payment-success">
      <Navbar />
      <div className="success-card">
        <div className="success-icon-wrap">✅</div>
        <h2 className="success-title">Booking Confirmed!</h2>
        <p className="success-sub">
          Payment verified. Your session with <strong>{expert.name}</strong> is confirmed.
          A confirmation has been sent to your email.
        </p>

        {/* Details */}
        <div style={{ background: '#f8f9fa', borderRadius: 12,
          padding: '4px 16px', marginBottom: 20,
          border: '1px solid #e0e0e0', textAlign: 'left' }}>
          {[
            { label: 'Booking ID',     value: booking.id },
            { label: 'Expert',         value: expert.name },
            { label: 'Specialization', value: expert.specialization },
            { label: 'Date & Time',    value: `${booking.date} at ${booking.time}` },
            { label: 'Duration',       value: `${booking.duration} minutes` },
            { label: 'Amount Paid',    value: `₹${expert.price}` },
            { label: 'UTR Number',     value: utr },
            { label: 'UPI ID Paid To', value: ADMIN_UPI },
          ].map(row => (
            <div key={row.label} className="success-detail-row">
              <span className="sdl">{row.label}</span>
              <span className="sdr">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Video link */}
        <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#444',
          marginBottom: 8, textAlign: 'left' }}>
          🔗 Your secure video link:
        </p>
        <div className="video-link-box">
          <span className="video-link-text">{videoLink}</span>
          <button className="video-copy-btn" onClick={copyLink}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: 0 }}>
          This link is valid only for you and the expert. It activates 15 minutes before your session.
        </p>

        <div className="success-actions">
          <button className="success-btn-primary"
            onClick={() => navigate('/consultee-dashboard')}>
            My Bookings
          </button>
          <button className="success-btn-secondary"
            onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Payment Page ────────────────────────────────────────
export default function Payment() {
  const navigate  = useNavigate()
  const location  = useLocation()

  // Accept booking + expert from router state, fall back to mock data
  const booking = location.state?.booking || MOCK_BOOKING
  const expert  = location.state?.expert  || MOCK_EXPERT

  const [utr, setUtr]           = useState('')
  const [utrTouched, setTouched] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [expired, setExpired]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [videoLink, setVideoLink] = useState('')
  const [copiedUPI, setCopiedUPI] = useState(false)
  const [toast, setToast]       = useState(null)
  const [error, setError]       = useState('')

  const utrRef = useRef(null)

  // Validation state
  const utrValid   = isValidUTR(utr)
  const utrInvalid = utrTouched && utr.length > 0 && !utrValid
  const utrStatus  = !utrTouched || utr.length === 0
    ? ''
    : utrValid
    ? 'valid'
    : 'invalid'

  function copyUPI() {
    navigator.clipboard?.writeText(ADMIN_UPI).catch(() => {})
    setCopiedUPI(true)
    setTimeout(() => setCopiedUPI(false), 2000)
  }

  async function handleSubmit() {
    setTouched(true)
    setError('')

    if (!utr.trim()) {
      setError('Please enter the 12-digit UTR / transaction reference number.')
      utrRef.current?.focus()
      return
    }
    if (!utrValid) {
      setError('UTR number must be exactly 12 digits (numbers only).')
      utrRef.current?.focus()
      return
    }
    if (expired) {
      setError('Payment window has expired. Please restart the booking.')
      return
    }

    setLoading(true)
    try {
      // ── Replace with real API call ──────────────────────────
      // const res = await fetch('/api/payments/verify', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${localStorage.getItem('token')}`,
      //   },
      //   body: JSON.stringify({
      //     bookingId: booking.id,
      //     utrNumber: utr.trim(),
      //     upiId: ADMIN_UPI,
      //     amount: expert.price,
      //   }),
      // })
      // const data = await res.json()
      // if (!res.ok) throw new Error(data.error || 'Verification failed')
      // setVideoLink(data.videoLink)
      // ────────────────────────────────────────────────────────

      // Simulate API call
      await new Promise(r => setTimeout(r, 1800))
      const link = generateVideoLink(booking.id)
      setVideoLink(link)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Verification failed. Please check your UTR and try again.')
      setToast({ msg: 'Payment verification failed. Try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ────────────────────────────────────────
  if (success) {
    return (
      <SuccessScreen
        booking={booking}
        expert={expert}
        utr={utr.trim()}
        videoLink={videoLink}
        navigate={navigate}
      />
    )
  }

  // ── Expired screen ────────────────────────────────────────
  if (expired) {
    return (
      <div className="payment-success">
        <Navbar />
        <div className="success-card">
          <div className="success-icon-wrap" style={{ background: '#fce4ec', borderColor: '#f48fb1' }}>
            ⏰
          </div>
          <h2 className="success-title" style={{ color: '#b71c1c' }}>Session Expired</h2>
          <p className="success-sub">
            Your 10-minute payment window has expired. Please go back and restart the booking process.
          </p>
          <div className="success-actions">
            <button className="success-btn-primary" onClick={() => navigate(-1)}>
              Try Again
            </button>
            <button className="success-btn-secondary" onClick={() => navigate('/')}>
              Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main payment UI ───────────────────────────────────────
  return (
    <div className="payment-page">
      <Navbar />

      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* ── Hero ── */}
      <div className="payment-hero">
        <div className="payment-orb payment-orb-1" />
        <div className="payment-orb payment-orb-2" />

        <div className="payment-hero-inner">
          <div className="payment-hero-label">
            <span>🔒</span> Secure Payment
          </div>
          <h1 className="payment-hero-title">Complete Your Booking</h1>
          <p className="payment-hero-sub">
            Pay via UPI · Enter your transaction reference · Get instant confirmation
          </p>

          {/* Progress steps */}
          <div className="payment-steps">
            <div className="payment-step">
              <div className="step-circle done">✓</div>
              <span className="step-label">Book Expert</span>
            </div>
            <div className="step-line done" />
            <div className="payment-step">
              <div className="step-circle active">2</div>
              <span className="step-label active">Make Payment</span>
            </div>
            <div className="step-line" />
            <div className="payment-step">
              <div className="step-circle pending">3</div>
              <span className="step-label pending">Get Confirmed</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="payment-body">

        {/* ════ LEFT COLUMN ════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Booking Details card */}
          <div className="pay-card">
            <div className="pay-card-header">
              <div className="pay-card-header-icon">📋</div>
              <h3 className="pay-card-title">Booking Details</h3>
            </div>
            <div className="pay-card-body">

              {/* Expert mini profile */}
              <div className="expert-mini">
                <div className="expert-mini-avatar">{expert.initials}</div>
                <div className="expert-mini-info">
                  <div className="expert-mini-name">{expert.name}</div>
                  <div className="expert-mini-spec">
                    <Stars rating={expert.rating} />
                    <span style={{ color: '#888', marginLeft: 4 }}>
                      {expert.rating} ({expert.totalReviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="expert-mini-price">₹{expert.price}</div>
              </div>

              {/* Detail rows */}
              {[
                { icon: '🏥', label: 'Specialization', value: expert.specialization },
                { icon: '📂', label: 'Category',        value: expert.category },
                { icon: '📅', label: 'Experience',      value: `${expert.experience} years` },
                { icon: '📆', label: 'Date',            value: booking.date },
                { icon: '🕐', label: 'Time',            value: booking.time + ' IST' },
                { icon: '⏱️', label: 'Duration',        value: `${booking.duration} minutes` },
                { icon: '🆔', label: 'Booking ID',      value: booking.id },
              ].map(row => (
                <div key={row.label} className="booking-summary-row">
                  <span className="bsr-label">
                    <span>{row.icon}</span>{row.label}
                  </span>
                  <span className="bsr-value">{row.value}</span>
                </div>
              ))}

              {/* Amount breakdown */}
              <div className="amount-breakdown" style={{ marginTop: 16 }}>
                <div className="ab-row">
                  <span>Consultation fee</span>
                  <span>₹{expert.price}</span>
                </div>
                <div className="ab-row">
                  <span>Platform fee</span>
                  <span style={{ color: '#26a69a', fontWeight: 700 }}>FREE</span>
                </div>
                <div className="ab-row">
                  <span>GST</span>
                  <span>₹0</span>
                </div>
                <div className="ab-row total">
                  <span>Total Payable</span>
                  <span className="ab-amount">₹{expert.price}</span>
                </div>
              </div>

            </div>
          </div>

          {/* How to pay */}
          <div className="pay-card">
            <div className="pay-card-header">
              <div className="pay-card-header-icon">📖</div>
              <h3 className="pay-card-title">How to Pay</h3>
            </div>
            <div className="pay-card-body">
              <div className="how-to-pay">
                {[
                  { n: 1, text: <><strong>Open</strong> any UPI app — PhonePe, GPay, Paytm, BHIM</> },
                  { n: 2, text: <><strong>Scan the QR code</strong> or enter UPI ID: <strong>{ADMIN_UPI}</strong></> },
                  { n: 3, text: <><strong>Enter amount</strong> ₹{expert.price} and complete the payment</> },
                  { n: 4, text: <><strong>Copy the 12-digit UTR</strong> from your payment success screen</> },
                  { n: 5, text: <><strong>Paste the UTR</strong> in the field on the right and click Submit</> },
                ].map(s => (
                  <div key={s.n} className="htp-step">
                    <div className="htp-num">{s.n}</div>
                    <div className="htp-text">{s.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        {/* ════ end LEFT COLUMN ════ */}

        {/* ════ RIGHT COLUMN ════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* QR + UPI + UTR card */}
          <div className="pay-card">
            <div className="pay-card-header">
              <div className="pay-card-header-icon">💳</div>
              <h3 className="pay-card-title">Pay via UPI</h3>
            </div>
            <div className="pay-card-body">

              {/* Countdown timer */}
              <CountdownTimer onExpire={() => setExpired(true)} />

              {/* QR code */}
              <div className="qr-section">
                <p className="qr-title">Scan to pay ₹{expert.price}</p>
                <div className="qr-wrapper">
                  <span className="qr-scan-badge">Scan Me</span>
                  <img
                    src={QR_IMAGE_SRC}
                    alt="Admin payment QR code"
                    className="qr-image"
                    onError={e => {
                      // Fallback if qr.jpeg not found — show placeholder box
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  {/* Fallback placeholder (hidden by default) */}
                  <div style={{ display: 'none', width: 200, height: 200,
                    background: 'linear-gradient(135deg,#e0f7fa,#f0fdff)',
                    borderRadius: 10, alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'column',
                    color: '#00838f', fontSize: '0.8rem', fontWeight: 700,
                    textAlign: 'center', padding: 20, boxSizing: 'border-box' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 8 }}>📱</div>
                    <div>QR Code</div>
                    <div style={{ fontSize: '0.7rem', marginTop: 4, opacity: 0.7 }}>
                      Place qr.jpeg in /public
                    </div>
                  </div>
                </div>

                {/* UPI ID pill */}
                <div className="upi-pill" onClick={copyUPI} title="Click to copy UPI ID">
                  <span className="upi-label">UPI ID</span>
                  <span className="upi-id">{ADMIN_UPI}</span>
                  {copiedUPI
                    ? <span className="upi-copied">✓ Copied!</span>
                    : <span className="upi-copy-icon">📋</span>}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: 10 }}>
                  Tap the UPI ID to copy · Supports PhonePe, GPay, Paytm, BHIM
                </p>
              </div>

              {/* Divider */}
              <div className="pay-divider">
                <div className="pay-divider-line" />
                <span className="pay-divider-text">After payment, enter UTR below</span>
                <div className="pay-divider-line" />
              </div>

              {/* Error alert */}
              {error && (
                <div className="pay-alert pay-alert-error">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* UTR input */}
              <label className="utr-label" htmlFor="utr-input">
                UTR / Transaction Reference Number
              </label>

              <div className="utr-input-wrap">
                <span className="utr-input-icon">🔢</span>
                <input
                  ref={utrRef}
                  id="utr-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  className={`utr-input ${utrStatus}`}
                  placeholder="e.g. 416223847012"
                  value={utr}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 12)
                    setUtr(val)
                    setError('')
                  }}
                  onBlur={() => setTouched(true)}
                  autoComplete="off"
                />
              </div>

              {/* Validation feedback */}
              {utrValid && (
                <div className="utr-valid-msg">
                  <span>✅</span> Valid UTR number
                </div>
              )}
              {utrInvalid && (
                <div className="utr-invalid-msg">
                  <span>❌</span> UTR must be exactly 12 digits
                  {utr.length > 0 && ` (${utr.length}/12 entered)`}
                </div>
              )}
              {!utrTouched && (
                <div className="utr-hint">
                  <span>ℹ️</span>
                  Find the 12-digit UTR in your UPI app after payment
                </div>
              )}

              {/* Submit */}
              <button
                className={`pay-submit-btn ${loading ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={loading || expired}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Verifying Payment…
                  </>
                ) : (
                  <>
                    <span>✅</span>
                    Confirm Payment
                  </>
                )}
              </button>

              {/* Security badges */}
              <div className="security-badges">
                <div className="security-badge"><span>🔒</span> 256-bit SSL</div>
                <div className="security-badge"><span>🛡️</span> Secure UPI</div>
                <div className="security-badge"><span>✅</span> NPCI Verified</div>
              </div>

            </div>
          </div>

          {/* Info card */}
          <div className="pay-card">
            <div className="pay-card-body" style={{ padding: '20px 24px' }}>
              <div className="pay-alert pay-alert-info" style={{ marginBottom: 12 }}>
                <span>💡</span>
                <div>
                  <strong>Important:</strong> Enter the exact UTR number from your UPI app.
                  Your booking will be confirmed instantly after verification.
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.6 }}>
                Having trouble? Contact support at{' '}
                <span style={{ color: '#0084ff', fontWeight: 700 }}>
                  support@consultpro.in
                </span>
                {' '}or WhatsApp us at <strong>+91-9000000000</strong>.
                Refunds are processed within 5–7 business days if the session is cancelled.
              </div>
            </div>
          </div>

        </div>
        {/* ════ end RIGHT COLUMN ════ */}

      </div>
    </div>
  )
}
