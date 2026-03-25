/**
 * ExpertDashboard.jsx
 * ─────────────────────────────────────────────────────────────
 * Theme  : Light blue/teal (matches updated Homepage.css)
 *          Primary #0084ff → #00bcd4 → #26a69a
 *
 * Tabs   : Overview | Bookings | Availability | Documents | Earnings | Reviews | Settings
 *
 * Key features:
 *  • Stat cards (earnings, sessions, rating, pending)
 *  • Booking list with LIVE countdown → video call button
 *    unlocks exactly 15 mins before appointment
 *  • Availability slot editor (add / remove slots per day)
 *  • Document uploader with preview + admin-verification status
 *  • Earnings bar chart (last 6 months)
 *  • Reviews list with star ratings
 *  • Profile/settings editor
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/ExpertDashboard.css'

// ── helpers ────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0') }

/** Returns minutes until a booking starts (negative = already passed) */
function minsUntil(dateStr, timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const target = new Date(dateStr)
  target.setHours(h, m, 0, 0)
  return Math.floor((target - Date.now()) / 60000)
}

function formatCurrency(n) {
  return '₹' + Number(n).toLocaleString('en-IN')
}

// ── mock data ───────────────────────────────────────────────
const MOCK_EXPERT = {
  name: 'Dr. Priya Sharma',
  initials: 'PS',
  specialization: 'General Physician',
  category: 'Medical',
  experience: 15,
  price: 800,
  rating: 4.9,
  bio: '15 years of clinical experience. MBBS, MD from AIIMS Delhi.',
  phone: '+91 9876543210',
  email: 'priya@expert.com',
  approved: true,
  upiId: 'priya.sharma@ybl',
}

// Build demo bookings relative to NOW so the countdown is always realistic
function buildBookings() {
  const now = new Date()

  function bookingAt(offsetMins, status = 'confirmed') {
    const d = new Date(now.getTime() + offsetMins * 60000)
    return {
      date: d.toISOString().split('T')[0],
      time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    }
  }

  return [
    { id: 'b1', client: 'Arjun Kapoor',  amount: 800,  status: 'confirmed', ...bookingAt(10)   }, // 10 min away → button LIVE
    { id: 'b2', client: 'Meera Reddy',   amount: 800,  status: 'confirmed', ...bookingAt(90)   }, // 90 min away → button locked
    { id: 'b3', client: 'Sanjay Mehta',  amount: 800,  status: 'pending',   ...bookingAt(180)  },
    { id: 'b4', client: 'Deepa Nair',    amount: 800,  status: 'completed', ...bookingAt(-1440) }, // yesterday
    { id: 'b5', client: 'Rohit Sharma',  amount: 800,  status: 'completed', ...bookingAt(-2880) },
  ]
}

const ALL_SLOTS = [
  '07:00','08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00',
]

const MOCK_DOCS = [
  { id: 'd1', name: 'AIIMS_Degree.pdf',       size: '2.3 MB', status: 'verified',  icon: '📄' },
  { id: 'd2', name: 'Medical_License.pdf',    size: '1.1 MB', status: 'verified',  icon: '📋' },
  { id: 'd3', name: 'MBBS_Certificate.pdf',   size: '3.0 MB', status: 'pending',   icon: '🎓' },
]

const MOCK_REVIEWS = [
  { id: 'r1', name: 'Arjun K.',    rating: 5, text: 'Excellent consultation! Very thorough and patient.', date: 'Mar 18, 2026' },
  { id: 'r2', name: 'Meera R.',    rating: 5, text: 'Dr. Priya explained everything clearly. Highly recommend!', date: 'Mar 15, 2026' },
  { id: 'r3', name: 'Sanjay M.',   rating: 4, text: 'Very knowledgeable. Resolved my queries in one session.', date: 'Mar 10, 2026' },
  { id: 'r4', name: 'Deepa N.',    rating: 5, text: 'Best online consultation experience I have had.', date: 'Mar 5, 2026' },
]

const EARNINGS_DATA = [
  { month: 'Oct', amount: 12400 },
  { month: 'Nov', amount: 18600 },
  { month: 'Dec', amount: 14200 },
  { month: 'Jan', amount: 22800 },
  { month: 'Feb', amount: 19500 },
  { month: 'Mar', amount: 25600 },
]

// ── sub-components ──────────────────────────────────────────

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`ed-toast toast-${type}`}>
      <span>{type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span style={{ flex: 1 }}>{msg}</span>
      <span style={{ cursor: 'pointer', opacity: 0.7 }} onClick={onClose}>✕</span>
    </div>
  )
}

/** Countdown chip shown under a locked video button */
function CountdownChip({ dateStr, timeStr }) {
  const [mins, setMins] = useState(() => minsUntil(dateStr, timeStr))

  useEffect(() => {
    const t = setInterval(() => setMins(minsUntil(dateStr, timeStr)), 30000)
    return () => clearInterval(t)
  }, [dateStr, timeStr])

  if (mins <= 0) return null
  if (mins > 60) {
    const h = Math.floor(mins / 60), m = mins % 60
    return <div className="ed-video-countdown">Starts in {h}h {m}m</div>
  }
  return <div className="ed-video-countdown">Starts in {mins} min</div>
}

// ── TABS ────────────────────────────────────────────────────

/** Tab: Overview */
function OverviewTab({ bookings, navigate }) {
  const upcoming = bookings.filter(b => b.status === 'confirmed')
  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      {/* Pending verification notice */}
      <div style={{ background: 'linear-gradient(135deg,#e0f7fa,#f0fdff)',
        border: '1px solid #b2ebf2', borderRadius: 12,
        padding: '16px 20px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: '1.3rem' }}>✅</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#006064' }}>
            Profile Verified & Live
          </div>
          <div style={{ fontSize: '0.85rem', color: '#00838f', marginTop: 2 }}>
            Clients can find and book you. Keep your availability updated.
          </div>
        </div>
      </div>

      {/* Today's bookings */}
      <div className="ed-section">
        <div className="ed-section-header">
          <h3 className="ed-section-title"><span>📅</span> Today's Sessions</h3>
          <button className="ed-btn ed-btn-white" style={{ fontSize: '0.82rem' }}
            onClick={() => {}}>View all</button>
        </div>
        <BookingList bookings={upcoming.filter(b => b.date === today)} navigate={navigate} />
        {upcoming.filter(b => b.date === today).length === 0 && (
          <div className="ed-empty">
            <div className="ed-empty-icon">🌟</div>
            <p>No sessions today. Enjoy your day!</p>
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div className="ed-section">
        <div className="ed-section-header">
          <h3 className="ed-section-title"><span>⏰</span> Upcoming Sessions</h3>
        </div>
        <BookingList bookings={upcoming.filter(b => b.date >= today).slice(0, 4)} navigate={navigate} />
      </div>
    </div>
  )
}

/** Reusable booking list */
function BookingList({ bookings, navigate }) {
  if (bookings.length === 0) {
    return (
      <div className="ed-empty">
        <div className="ed-empty-icon">📭</div>
        <p>No bookings here yet.</p>
      </div>
    )
  }

  return (
    <div className="ed-booking-list">
      {bookings.map(b => {
        const mins = minsUntil(b.date, b.time)
        const canJoin = mins <= 15 && mins > -60 && b.status === 'confirmed'
        const [dayN, monthN] = (() => {
          const d = new Date(b.date)
          return [d.getDate(), d.toLocaleString('en-IN', { month: 'short' })]
        })()

        return (
          <div key={b.id} className="ed-booking-card">
            {/* Date block */}
            <div className="ed-booking-date">
              <div className="bd-day">{dayN}</div>
              <div className="bd-month">{monthN}</div>
            </div>

            {/* Info */}
            <div className="ed-booking-info">
              <div className="ed-booking-client">{b.client}</div>
              <div className="ed-booking-time">
                <span>🕐</span> {b.time} &nbsp;·&nbsp; 60 min
              </div>
            </div>

            {/* Amount */}
            <div className="ed-booking-amount">{formatCurrency(b.amount)}</div>

            {/* Status */}
            <span className={`ed-status status-${b.status}`}>
              {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
            </span>

            {/* Video button */}
            {b.status === 'confirmed' && (
              <div style={{ textAlign: 'center' }}>
                <button
                  className="ed-video-btn"
                  disabled={!canJoin}
                  onClick={() => canJoin && navigate('/video-room')}
                >
                  📹 {canJoin ? 'Join Call' : 'Video Call'}
                </button>
                {!canJoin && <CountdownChip dateStr={b.date} timeStr={b.time} />}
                {canJoin && (
                  <div className="ed-video-countdown" style={{ color: '#0084ff', fontWeight: 700 }}>
                    🔴 Live now!
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Tab: All Bookings */
function BookingsTab({ bookings, navigate }) {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="ed-section">
      <div className="ed-section-header">
        <h3 className="ed-section-title"><span>📖</span> All Bookings</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all','confirmed','pending','completed','cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '5px 12px', borderRadius: 20, border: 'none',
                background: filter === f ? '#00bcd4' : '#f0f0f0',
                color: filter === f ? '#fff' : '#444',
                fontWeight: 600, cursor: 'pointer',
                fontSize: '0.78rem', fontFamily: 'inherit',
                textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <BookingList bookings={filtered} navigate={navigate} />
    </div>
  )
}

/** Tab: Availability */
function AvailabilityTab({ showToast }) {
  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const [daySlots, setDaySlots] = useState({
    Monday:    ['09:00','10:00','11:00','14:00','15:00'],
    Tuesday:   ['09:00','10:00','14:00','15:00'],
    Wednesday: ['11:00','14:00','15:00','16:00'],
    Thursday:  ['09:00','10:00','11:00'],
    Friday:    ['14:00','15:00','16:00','17:00'],
    Saturday:  ['10:00','11:00'],
    Sunday:    [],
  })
  const [activeDay, setActiveDay] = useState('Monday')
  const [addModal, setAddModal]   = useState(false)
  const [newSlot, setNewSlot]     = useState('09:00')

  function removeSlot(day, slot) {
    setDaySlots(prev => ({ ...prev, [day]: prev[day].filter(s => s !== slot) }))
  }

  function addSlot() {
    if (daySlots[activeDay].includes(newSlot)) {
      showToast('Slot already exists!', 'error'); return
    }
    setDaySlots(prev => ({
      ...prev,
      [activeDay]: [...prev[activeDay], newSlot].sort(),
    }))
    setAddModal(false)
    showToast('Slot added successfully!', 'success')
  }

  function saveAvailability() {
    // API call: PUT /api/experts/availability  body: { daySlots }
    showToast('Availability saved!', 'success')
  }

  return (
    <div className="ed-section">
      <div className="ed-section-header">
        <h3 className="ed-section-title"><span>🗓️</span> Manage Availability</h3>
        <button className="ed-save-btn" onClick={saveAvailability}>Save Changes</button>
      </div>

      {/* Day selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {DAYS.map(day => (
          <button key={day} onClick={() => setActiveDay(day)}
            style={{ padding: '7px 16px', borderRadius: 20, border: 'none',
              background: activeDay === day
                ? 'linear-gradient(135deg,#0084ff,#00bcd4)' : '#f0f0f0',
              color: activeDay === day ? '#fff' : '#444',
              fontWeight: 600, cursor: 'pointer',
              fontSize: '0.85rem', fontFamily: 'inherit',
              transition: 'all 0.2s' }}>
            {day.slice(0, 3)}
            {daySlots[day].length > 0 && (
              <span style={{ marginLeft: 5, fontSize: '0.72rem',
                background: activeDay === day ? 'rgba(255,255,255,0.25)' : '#00bcd4',
                color: activeDay === day ? '#fff' : '#fff',
                borderRadius: 10, padding: '1px 6px' }}>
                {daySlots[day].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Slot chips for active day */}
      <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 14 }}>
        {activeDay} — {daySlots[activeDay].length} slot{daySlots[activeDay].length !== 1 ? 's' : ''} available.
        Hover a slot and click ✕ to remove it.
      </p>

      <div className="slots-grid">
        {daySlots[activeDay].map(slot => (
          <div key={slot} className="slot-chip active">
            {slot}
            <span className="slot-remove" onClick={() => removeSlot(activeDay, slot)}>✕</span>
          </div>
        ))}
        {daySlots[activeDay].length === 0 && (
          <div style={{ gridColumn: '1/-1', color: '#aaa', fontSize: '0.9rem' }}>
            No slots set for {activeDay}.
          </div>
        )}
        <button className="add-slot-btn" onClick={() => setAddModal(true)}>＋</button>
      </div>

      {/* Add slot modal */}
      {addModal && (
        <div className="ed-modal-overlay" onClick={() => setAddModal(false)}>
          <div className="ed-modal" onClick={e => e.stopPropagation()}>
            <h4 className="ed-modal-title">Add Slot — {activeDay}</h4>
            <div className="ed-input-group">
              <label className="ed-input-label">Select Time</label>
              <select className="ed-input" value={newSlot}
                onChange={e => setNewSlot(e.target.value)}>
                {ALL_SLOTS.filter(s => !daySlots[activeDay].includes(s)).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="ed-save-btn" onClick={addSlot}>Add Slot</button>
              <button onClick={() => setAddModal(false)}
                style={{ padding: '11px 20px', borderRadius: 9, border: '1px solid #e0e0e0',
                  background: '#fafafa', cursor: 'pointer', fontFamily: 'inherit',
                  fontWeight: 600, color: '#666' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Tab: Documents */
function DocumentsTab({ docs, setDocs, showToast }) {
  const fileInputRef = useRef(null)

  function handleFiles(files) {
    const newDocs = Array.from(files).map((f, i) => ({
      id: 'd' + Date.now() + i,
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
      status: 'pending',
      icon: f.type === 'application/pdf' ? '📄' : '🖼️',
    }))
    setDocs(prev => [...prev, ...newDocs])
    showToast(`${newDocs.length} document(s) uploaded for verification!`, 'success')
  }

  function removeDoc(id) {
    setDocs(prev => prev.filter(d => d.id !== id))
    showToast('Document removed.', 'info')
  }

  const statusMeta = {
    verified: { icon: '✅', label: 'Verified',        color: '#2e7d32' },
    pending:  { icon: '⏳', label: 'Under Review',    color: '#f57f17' },
    rejected: { icon: '❌', label: 'Rejected',        color: '#c62828' },
  }

  return (
    <div className="ed-section">
      <div className="ed-section-header">
        <h3 className="ed-section-title"><span>📁</span> Verification Documents</h3>
      </div>

      <div style={{ background: '#fff8e1', border: '1px solid #ffe082',
        borderRadius: 10, padding: '12px 16px', marginBottom: 20,
        fontSize: '0.85rem', color: '#5d4037', display: 'flex', gap: 10 }}>
        <span>💡</span>
        <span>Upload your degrees, licenses, and certificates. Admin will verify them within 24–48 hours.</span>
      </div>

      {/* Drop zone */}
      <div className="doc-upload-area"
        onClick={() => fileInputRef.current.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}>
        <div className="doc-upload-icon">☁️</div>
        <h4>Click or drag & drop files here</h4>
        <p>PDF, JPG, PNG up to 10MB each</p>
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Document list */}
      {docs.length === 0 ? (
        <div className="ed-empty">
          <div className="ed-empty-icon">📂</div>
          <p>No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="doc-list">
          {docs.map(doc => {
            const meta = statusMeta[doc.status] || statusMeta.pending
            return (
              <div key={doc.id} className="doc-item">
                <div className="doc-icon">{doc.icon}</div>
                <div className="doc-info">
                  <div className="doc-name">{doc.name}</div>
                  <div className="doc-size">{doc.size}</div>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: meta.color,
                  display: 'flex', alignItems: 'center', gap: 4 }}>
                  {meta.icon} {meta.label}
                </span>
                {doc.status !== 'verified' && (
                  <button onClick={() => removeDoc(doc.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer',
                      color: '#aaa', fontSize: '1rem', padding: 4 }}>✕</button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Tab: Earnings */
function EarningsTab() {
  const max = Math.max(...EARNINGS_DATA.map(d => d.amount))
  const total = EARNINGS_DATA.reduce((s, d) => s + d.amount, 0)
  const thisMonth = EARNINGS_DATA[EARNINGS_DATA.length - 1].amount

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Earnings', value: formatCurrency(total), icon: '💰' },
          { label: 'This Month',     value: formatCurrency(thisMonth), icon: '📈' },
          { label: 'Pending Payout', value: formatCurrency(3200), icon: '⏳' },
        ].map(c => (
          <div key={c.label} className="ed-section" style={{ textAlign: 'center', marginBottom: 0 }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800,
              background: 'linear-gradient(135deg,#0084ff,#00bcd4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text' }}>{c.value}</div>
            <div style={{ fontSize: '0.82rem', color: '#888', marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="ed-section">
        <div className="ed-section-header">
          <h3 className="ed-section-title"><span>📊</span> Monthly Earnings</h3>
        </div>
        <div className="earnings-bars">
          {EARNINGS_DATA.map(d => (
            <div key={d.month} className="earnings-bar-wrap">
              <div className="earnings-bar-val">{formatCurrency(d.amount)}</div>
              <div className="earnings-bar"
                style={{ height: `${(d.amount / max) * 90}px` }} />
              <div className="earnings-bar-label">{d.month}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout info */}
      <div className="ed-section">
        <div className="ed-section-header">
          <h3 className="ed-section-title"><span>🏦</span> Payout Details</h3>
          <button className="ed-save-btn" style={{ fontSize: '0.85rem' }}>
            Request Payout
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div className="ed-input-label">UPI ID</div>
            <div style={{ padding: '10px 14px', background: '#f0fdff',
              border: '1px solid #b2ebf2', borderRadius: 9, fontSize: '0.93rem',
              color: '#006064', fontWeight: 600 }}>priya.sharma@ybl</div>
          </div>
          <div>
            <div className="ed-input-label">Platform Commission</div>
            <div style={{ padding: '10px 14px', background: '#f0fdff',
              border: '1px solid #b2ebf2', borderRadius: 9, fontSize: '0.93rem',
              color: '#006064', fontWeight: 600 }}>10% per session</div>
          </div>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#aaa', marginTop: 14 }}>
          Payouts are processed every Monday for the previous week's confirmed sessions.
        </p>
      </div>
    </div>
  )
}

/** Tab: Reviews */
function ReviewsTab() {
  const avg = (MOCK_REVIEWS.reduce((s,r) => s + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1)

  return (
    <div className="ed-section">
      <div className="ed-section-header">
        <h3 className="ed-section-title"><span>⭐</span> Client Reviews</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800,
            background: 'linear-gradient(135deg,#0084ff,#00bcd4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text' }}>{avg}</span>
          <div>
            <div style={{ color: '#ffa726', fontSize: '1rem' }}>{'★'.repeat(Math.round(avg))}</div>
            <div style={{ fontSize: '0.78rem', color: '#888' }}>{MOCK_REVIEWS.length} reviews</div>
          </div>
        </div>
      </div>
      {MOCK_REVIEWS.map(r => (
        <div key={r.id} className="review-item">
          <div className="review-header">
            <span className="review-name">{r.name}</span>
            <span className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
          </div>
          <div className="review-text">{r.text}</div>
          <div className="review-date">{r.date}</div>
        </div>
      ))}
    </div>
  )
}

/** Tab: Settings / Profile */
function SettingsTab({ expert, setExpert, showToast }) {
  const [form, setForm] = useState({ ...expert })

  function save() {
    setExpert({ ...form })
    // API call: PUT /api/experts/profile  body: form
    showToast('Profile updated successfully!', 'success')
  }

  function upd(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div>
      <div className="ed-section">
        <div className="ed-section-header">
          <h3 className="ed-section-title"><span>👤</span> Profile Information</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="ed-input-group">
            <label className="ed-input-label">Full Name</label>
            <input className="ed-input" value={form.name}
              onChange={e => upd('name', e.target.value)} />
          </div>
          <div className="ed-input-group">
            <label className="ed-input-label">Specialization</label>
            <input className="ed-input" value={form.specialization}
              onChange={e => upd('specialization', e.target.value)} />
          </div>
          <div className="ed-input-group">
            <label className="ed-input-label">Email</label>
            <input className="ed-input" type="email" value={form.email}
              onChange={e => upd('email', e.target.value)} />
          </div>
          <div className="ed-input-group">
            <label className="ed-input-label">Phone</label>
            <input className="ed-input" value={form.phone}
              onChange={e => upd('phone', e.target.value)} />
          </div>
          <div className="ed-input-group">
            <label className="ed-input-label">Consultation Fee (₹)</label>
            <input className="ed-input" type="number" value={form.price}
              onChange={e => upd('price', e.target.value)} />
          </div>
          <div className="ed-input-group">
            <label className="ed-input-label">Years of Experience</label>
            <input className="ed-input" type="number" value={form.experience}
              onChange={e => upd('experience', e.target.value)} />
          </div>
          <div className="ed-input-group">
            <label className="ed-input-label">UPI ID (for payouts)</label>
            <input className="ed-input" value={form.upiId}
              onChange={e => upd('upiId', e.target.value)} />
          </div>
        </div>
        <div className="ed-input-group">
          <label className="ed-input-label">Bio</label>
          <textarea className="ed-input ed-textarea" value={form.bio}
            onChange={e => upd('bio', e.target.value)} />
        </div>
        <button className="ed-save-btn" onClick={save}>Save Profile</button>
      </div>

      {/* Danger zone */}
      <div className="ed-section" style={{ borderColor: '#ffcdd2' }}>
        <h3 className="ed-section-title" style={{ color: '#c62828', marginBottom: 16 }}>
          <span>⚠️</span> Account Actions
        </h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ padding: '9px 20px', borderRadius: 9,
            border: '1.5px solid #ef5350', background: 'transparent',
            color: '#c62828', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.88rem' }}>
            Pause My Profile
          </button>
          <button style={{ padding: '9px 20px', borderRadius: 9,
            border: '1.5px solid #ef5350', background: '#fce4ec',
            color: '#c62828', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.88rem' }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ──────────────────────────────────────────
export default function ExpertDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [bookings]                = useState(buildBookings)
  const [docs, setDocs]           = useState(MOCK_DOCS)
  const [expert, setExpert]       = useState(MOCK_EXPERT)
  const [toast, setToast]         = useState(null)

  function showToast(msg, type = 'info') {
    setToast({ msg, type })
  }

  const pendingCount = bookings.filter(b => b.status === 'pending').length
  const totalEarnings = EARNINGS_DATA.reduce((s,d) => s + d.amount, 0)
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length
  const completedCount = bookings.filter(b => b.status === 'completed').length

  const TABS = [
    { key: 'overview',     label: 'Overview',      icon: '🏠' },
    { key: 'bookings',     label: 'Bookings',      icon: '📖', count: pendingCount },
    { key: 'availability', label: 'Availability',  icon: '🗓️' },
    { key: 'documents',    label: 'Documents',     icon: '📁' },
    { key: 'earnings',     label: 'Earnings',      icon: '💰' },
    { key: 'reviews',      label: 'Reviews',       icon: '⭐' },
    { key: 'settings',     label: 'Settings',      icon: '⚙️' },
  ]

  return (
    <div className="expert-dashboard">
      <Navbar />

      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="ed-header">
        <div className="ed-header-inner">
          <div className="ed-profile-row">
            <div className="ed-profile-left">
              <div className="ed-avatar">{expert.initials}</div>
              <div>
                <h1 className="ed-name">{expert.name}</h1>
                <div className="ed-meta">
                  <span>{expert.specialization}</span>
                  <span>·</span>
                  <span>{expert.category}</span>
                  <span>·</span>
                  <span>{expert.experience} yrs exp</span>
                  <span
                    className={`ed-badge ${expert.approved ? 'badge-verified' : 'badge-pending'}`}>
                    {expert.approved ? '✓ Verified' : '⏳ Pending'}
                  </span>
                  {expert.approved && (
                    <span className="ed-badge badge-live">🟢 Live</span>
                  )}
                </div>
              </div>
            </div>
            <div className="ed-header-actions">
              <button className="ed-btn ed-btn-outline"
                onClick={() => navigate('/')}>
                🏠 Home
              </button>
              <button className="ed-btn ed-btn-white"
                onClick={() => navigate('/login')}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tabs pinned to bottom of header */}
        <div className="ed-tabs">
          {TABS.map(t => (
            <button key={t.key}
              className={`ed-tab ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}>
              <span>{t.icon}</span>
              {t.label}
              {t.count > 0 && (
                <span className="ed-tab-badge">{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="ed-body">

        {/* Stat cards — always visible */}
        <div className="ed-stats">
          <div className="ed-stat-card">
            <div className="ed-stat-icon stat-blue">💰</div>
            <div className="ed-stat-info">
              <div className="ed-stat-value">{formatCurrency(totalEarnings)}</div>
              <div className="ed-stat-label">Total Earnings</div>
              <div className="ed-stat-trend trend-up">↑ 12% this month</div>
            </div>
          </div>
          <div className="ed-stat-card">
            <div className="ed-stat-icon stat-teal">📅</div>
            <div className="ed-stat-info">
              <div className="ed-stat-value">{confirmedCount}</div>
              <div className="ed-stat-label">Upcoming Sessions</div>
              <div className="ed-stat-trend trend-up">
                {pendingCount > 0 ? `↑ ${pendingCount} pending` : 'All confirmed'}
              </div>
            </div>
          </div>
          <div className="ed-stat-card">
            <div className="ed-stat-icon stat-green">⭐</div>
            <div className="ed-stat-info">
              <div className="ed-stat-value">{expert.rating}</div>
              <div className="ed-stat-label">Avg Rating</div>
              <div className="ed-stat-trend trend-up">↑ {MOCK_REVIEWS.length} reviews</div>
            </div>
          </div>
          <div className="ed-stat-card">
            <div className="ed-stat-icon stat-orange">✅</div>
            <div className="ed-stat-info">
              <div className="ed-stat-value">{completedCount}</div>
              <div className="ed-stat-label">Completed Sessions</div>
              <div className="ed-stat-trend">All time</div>
            </div>
          </div>
        </div>

        {/* Active tab content */}
        {activeTab === 'overview'     && <OverviewTab bookings={bookings} navigate={navigate} />}
        {activeTab === 'bookings'     && <BookingsTab bookings={bookings} navigate={navigate} />}
        {activeTab === 'availability' && <AvailabilityTab showToast={showToast} />}
        {activeTab === 'documents'    && <DocumentsTab docs={docs} setDocs={setDocs} showToast={showToast} />}
        {activeTab === 'earnings'     && <EarningsTab />}
        {activeTab === 'reviews'      && <ReviewsTab />}
        {activeTab === 'settings'     && <SettingsTab expert={expert} setExpert={setExpert} showToast={showToast} />}

      </div>
    </div>
  )
}
