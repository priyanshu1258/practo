import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userPage.css";

// ─── SVG Icons (inline, no emoji) ───────────────────────────────────────────
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2" width="14" height="14">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const StarBigIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2" width="32" height="32">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const VideoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const CreditCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);
const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const PenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const MonitorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const DollarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

// ─── Static Data ─────────────────────────────────────────────────────────────
const FIELDS = [
  { id: "all", label: "All Fields", icon: <FilterIcon /> },
  { id: "technical", label: "Technical", icon: <MonitorIcon /> },
  { id: "medical", label: "Medical", icon: <HeartIcon /> },
  { id: "business", label: "Business", icon: <BriefcaseIcon /> },
  { id: "design", label: "Design", icon: <PenIcon /> },
  { id: "content", label: "Content", icon: <BookIcon /> },
  { id: "finance", label: "Finance", icon: <TrendingUpIcon /> },
  { id: "legal", label: "Legal", icon: <ActivityIcon /> },
];

const EXPERTS = [
  {
    id: 1, name: "Dr. Arjun Mehta", initials: "AM",
    title: "Senior Medical Consultant", field: "medical",
    bio: "15+ years in internal medicine and diagnostics. Former HOD at AIIMS Delhi. Specializes in chronic disease management and preventive care.",
    rating: 4.9, reviews: 312, sessions: 1280, experience: "15 yrs",
    price: 1200, status: "available",
  },
  {
    id: 2, name: "Priya Sharma", initials: "PS",
    title: "Full-Stack Architect", field: "technical",
    bio: "Ex-Google engineer. Expert in cloud infrastructure, system design, and scalable backend development. Mentored 200+ engineers.",
    rating: 4.8, reviews: 214, sessions: 890, experience: "11 yrs",
    price: 900, status: "available",
  },
  {
    id: 3, name: "Rahul Singhania", initials: "RS",
    title: "Business Strategy Consultant", field: "business",
    bio: "MBA from IIM-A. Helped over 50 startups scale from seed to Series B. Expertise in go-to-market strategy and operations.",
    rating: 4.7, reviews: 186, sessions: 740, experience: "13 yrs",
    price: 1500, status: "busy",
  },
  {
    id: 4, name: "Neha Kapoor", initials: "NK",
    title: "UX/Product Designer", field: "design",
    bio: "10 years designing products at Flipkart and Swiggy. Passionate about accessibility, user research, and design systems.",
    rating: 4.9, reviews: 275, sessions: 1020, experience: "10 yrs",
    price: 800, status: "available",
  },
  {
    id: 5, name: "Vikram Joshi", initials: "VJ",
    title: "Chartered Financial Analyst", field: "finance",
    bio: "CFA charterholder with 14 years in equity research and wealth management. Specializes in portfolio optimization and tax planning.",
    rating: 4.6, reviews: 141, sessions: 610, experience: "14 yrs",
    price: 1100, status: "available",
  },
  {
    id: 6, name: "Anjali Rao", initials: "AR",
    title: "Content Strategy Lead", field: "content",
    bio: "Ex-editorial director at Condé Nast India. Specializes in brand storytelling, SEO content, and thought leadership articles.",
    rating: 4.8, reviews: 198, sessions: 830, experience: "9 yrs",
    price: 600, status: "offline",
  },
  {
    id: 7, name: "Adv. Suresh Patel", initials: "SP",
    title: "Corporate Law Specialist", field: "legal",
    bio: "Senior advocate with 18 years of practice in corporate law, IP rights, and startup legal compliance. Delhi High Court.",
    rating: 4.7, reviews: 163, sessions: 520, experience: "18 yrs",
    price: 1800, status: "available",
  },
  {
    id: 8, name: "Kiran Bhatia", initials: "KB",
    title: "Cloud & DevOps Engineer", field: "technical",
    bio: "AWS Certified Solutions Architect. Expert in Kubernetes, CI/CD pipelines, and infrastructure-as-code for enterprise clients.",
    rating: 4.5, reviews: 109, sessions: 430, experience: "8 yrs",
    price: 750, status: "busy",
  },
];

const LIVE_EXPERTS = [
  {
    id: 101, name: "Dr. Meera Nair", initials: "MN",
    title: "Psychologist & Wellness Coach", field: "medical",
    rating: 4.8, price: 500, waitTime: "Available now", status: "available",
  },
  {
    id: 102, name: "Saurabh Gupta", initials: "SG",
    title: "Digital Marketing Strategist", field: "content",
    rating: 4.6, price: 400, waitTime: "Available now", status: "available",
  },
  {
    id: 103, name: "Deepa Krishnan", initials: "DK",
    title: "Career & Leadership Coach", field: "business",
    rating: 4.9, price: 700, waitTime: "~2 min wait", status: "available",
  },
  {
    id: 104, name: "Amit Verma", initials: "AV",
    title: "Python & Data Science Mentor", field: "technical",
    rating: 4.7, price: 450, waitTime: "Available now", status: "available",
  },
];

const SESSION_HISTORY = [
  { id: 1, expert: "Dr. Arjun Mehta", field: "Medical", date: "14 Mar 2026", duration: "45 min", amount: 1200, status: "completed", rated: true },
  { id: 2, expert: "Priya Sharma", field: "Technical", date: "8 Mar 2026", duration: "60 min", amount: 900, status: "completed", rated: false },
  { id: 3, expert: "Rahul Singhania", field: "Business", date: "28 Mar 2026", duration: "60 min", amount: 1500, status: "upcoming", rated: false },
  { id: 4, expert: "Neha Kapoor", field: "Design", date: "21 Feb 2026", duration: "30 min", amount: 800, status: "completed", rated: true },
  { id: 5, expert: "Vikram Joshi", field: "Finance", date: "5 Feb 2026", duration: "45 min", amount: 1100, status: "cancelled", rated: false },
];

const PAYMENTS = [
  { id: 1, label: "Session – Dr. Arjun Mehta", date: "14 Mar 2026", amount: 1200 },
  { id: 2, label: "Session – Priya Sharma", date: "8 Mar 2026", amount: 900 },
  { id: 3, label: "Session – Neha Kapoor", date: "21 Feb 2026", amount: 800 },
  { id: 4, label: "Session – Vikram Joshi", date: "5 Feb 2026", amount: 1100 },
  { id: 5, label: "Live – Dr. Meera Nair", date: "18 Jan 2026", amount: 500 },
];

const SLOTS = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const renderStars = (rating, size = "sm") =>
  [1, 2, 3, 4, 5].map((i) =>
    size === "sm"
      ? <StarIcon key={i} filled={i <= Math.round(rating)} />
      : <StarBigIcon key={i} filled={i <= Math.round(rating)} />
  );

// ─── Sub-components ──────────────────────────────────────────────────────────
function ExpertCard({ expert, onBook, delay = 0 }) {
  return (
    <div className="expert-card" style={{ animationDelay: `${delay}s` }}>
      <div className="expert-card-header">
        <div className="expert-avatar">{expert.initials}</div>
        <div className="expert-meta">
          <div className="expert-name">{expert.name}</div>
          <div className="expert-title">{expert.title}</div>
          <span className="expert-field-badge">{FIELDS.find(f => f.id === expert.field)?.label}</span>
        </div>
        <div className={`expert-card-status`}>
          <span className={`status-dot ${expert.status}`} />
          <span className={`status-text ${expert.status}`}>
            {expert.status === "available" ? "Available" : expert.status === "busy" ? "Busy" : "Offline"}
          </span>
        </div>
      </div>

      <p className="expert-card-bio">{expert.bio}</p>

      <div className="expert-card-stats">
        <div className="expert-stat">
          <div className="expert-stat-value">{expert.sessions.toLocaleString()}+</div>
          <div className="expert-stat-label">Sessions</div>
        </div>
        <div className="expert-stat">
          <div className="expert-stat-value">{expert.experience}</div>
          <div className="expert-stat-label">Experience</div>
        </div>
        <div className="expert-stat">
          <div className="expert-stat-value">{expert.reviews}</div>
          <div className="expert-stat-label">Reviews</div>
        </div>
      </div>

      <div className="expert-rating-row">
        <div className="expert-rating-stars">{renderStars(expert.rating)}</div>
        <span className="expert-rating-num">{expert.rating}</span>
        <span className="expert-rating-count">({expert.reviews} reviews)</span>
      </div>

      <div className="expert-card-footer">
        <div className="expert-price">
          <span className="expert-price-amount">₹{expert.price.toLocaleString()}</span>
          <span className="expert-price-unit">per session</span>
        </div>
        <button className="btn-book" onClick={() => onBook(expert)} disabled={expert.status === "offline"}>
          {expert.status === "offline" ? "Unavailable" : "Book Session"}
        </button>
      </div>
    </div>
  );
}

function LiveExpertRow({ expert, onConnect, delay = 0 }) {
  return (
    <div className="live-expert-card" style={{ animationDelay: `${delay}s` }}>
      <div className="expert-avatar" style={{ width: 52, height: 52, fontSize: "1.1rem" }}>{expert.initials}</div>
      <div className="live-expert-info">
        <div className="expert-name">{expert.name}</div>
        <div className="expert-title">{expert.title}</div>
        <div className="live-wait-time">
          <ClockIcon /> {expert.waitTime}
        </div>
      </div>
      <div className="live-expert-right">
        <div className="expert-rating-row" style={{ marginBottom: 0 }}>
          <div className="expert-rating-stars">{renderStars(expert.rating)}</div>
          <span className="expert-rating-num">{expert.rating}</span>
        </div>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#007a55" }}>₹{expert.price}/session</div>
        <button className="btn-connect" onClick={() => onConnect(expert)}>Connect Now</button>
      </div>
    </div>
  );
}

// ─── Book Session Modal ───────────────────────────────────────────────────────
function BookModal({ expert, onClose }) {
  const navigate = useNavigate();
  const [slot, setSlot] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("30");
  const platformFee = Math.round(expert.price * 0.05);
  const total = expert.price + platformFee;
  function handleConfirmAndPay() {
    onClose();
    navigate("/payment", {
      state: {
        booking: {
          id: "BK" + Date.now(),
          date: date || new Date().toISOString().split("T")[0],
          time: slot || "10:00 AM",
          duration: Number(duration),
          status: "pending",
        },
        expert: {
          name:           expert.name,
          initials:       expert.initials,
          specialization: expert.title,
          category:       expert.field,
          experience:     expert.experience,
          price:          expert.price,
          rating:         expert.rating,
          totalReviews:   expert.reviews,
        },
      },
    });
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>Book a Session</h3>
          <button className="modal-close" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="modal-body">
          <div className="modal-expert-row">
            <div className="expert-avatar" style={{ width: 50, height: 50, fontSize: "1.1rem", borderRadius: 10 }}>{expert.initials}</div>
            <div>
              <div className="expert-name">{expert.name}</div>
              <div className="expert-title">{expert.title}</div>
            </div>
          </div>

          <div className="modal-field">
            <label>Preferred Date</label>
            <input className="modal-input" type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
          </div>

          <div className="modal-field">
            <label>Time Slot</label>
            <select className="modal-select" value={slot} onChange={e => setSlot(e.target.value)}>
              <option value="">Select a time slot</option>
              {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="modal-field">
            <label>Duration</label>
            <select className="modal-select" value={duration} onChange={e => setDuration(e.target.value)}>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>

          <div className="modal-summary">
            <div className="modal-summary-row">
              <span>Session fee ({duration} min)</span>
              <span className="amount">₹{expert.price.toLocaleString()}</span>
            </div>
            <div className="modal-summary-row">
              <span>Platform fee (5%)</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="modal-summary-row total">
              <span>Total payable</span>
              <span className="amount">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button className="modal-pay-btn" onClick={handleConfirmAndPay}>
            Confirm & Pay ₹{total.toLocaleString()}
          </button>
          <p className="modal-note">
            A video call link will be sent to your registered email. Payment is fully secured.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Connect Live Modal ───────────────────────────────────────────────────────
function ConnectModal({ expert, onClose }) {
   const navigate = useNavigate();           // ← ADD THIS LINE

  // ← ADD THIS WHOLE FUNCTION
  function handlePayAndConnect() {
    onClose();
    navigate("/payment", {
      state: {
        booking: {
          id: "LIVE" + Date.now(),
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          duration: 30,
          status: "pending",
        },
        expert: {
          name:           expert.name,
          initials:       expert.initials,
          specialization: expert.title,
          category:       expert.field,
          experience:     "N/A",
          price:          expert.price,
          rating:         expert.rating,
          totalReviews:   0,
        },
      },
    });
  }
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-header" style={{ background: "linear-gradient(135deg, #00c87a, #00897b)" }}>
          <h3>Instant Live Consultation</h3>
          <button className="modal-close" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="modal-body">
          <div className="modal-expert-row">
            <div className="expert-avatar" style={{ width: 50, height: 50, fontSize: "1.1rem", borderRadius: 10, background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)", color: "#00897b" }}>{expert.initials}</div>
            <div>
              <div className="expert-name">{expert.name}</div>
              <div className="expert-title" style={{ color: "#00897b" }}>{expert.title}</div>
            </div>
          </div>

          <div className="modal-summary" style={{ background: "linear-gradient(135deg,rgba(0,200,122,0.05),rgba(0,188,200,0.05))", borderColor: "rgba(0,200,122,0.14)" }}>
            <div className="modal-summary-row">
              <span>Session fee (30 min)</span>
              <span className="amount" style={{ background: "linear-gradient(135deg,#00c87a,#00897b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>₹{expert.price}</span>
            </div>
            <div className="modal-summary-row">
              <span>Platform fee (5%)</span>
              <span>₹{Math.round(expert.price * 0.05)}</span>
            </div>
            <div className="modal-summary-row total">
              <span>Total payable</span>
              <span className="amount" style={{ background: "linear-gradient(135deg,#00c87a,#00897b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                ₹{expert.price + Math.round(expert.price * 0.05)}
              </span>
            </div>
          </div>

          <button className="modal-pay-btn" style={{ background: "linear-gradient(135deg,#00c87a,#00897b)", boxShadow: "0 6px 18px rgba(0,200,122,0.3)" }} onClick={handlePayAndConnect}>
            Pay & Connect Instantly
          </button>
          <p className="modal-note">
            You will be connected to a live video call immediately after payment. No booking required.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Rating Modal ─────────────────────────────────────────────────────────────
function RatingModal({ session, onClose }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>Rate Your Session</h3>
          <button className="modal-close" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: "0.95rem", color: "#555", marginBottom: 4 }}>How was your session with</p>
          <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a", marginBottom: 20 }}>{session.expert}?</p>

          <div className="rating-modal-stars">
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i} className="rating-star-btn"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(i)}>
                <StarBigIcon filled={i <= (hover || rating)} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ textAlign: "center", fontSize: "0.88rem", color: "#888", marginBottom: 16 }}>
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </p>
          )}

          <label className="rating-comment-label">Leave a comment (optional)</label>
          <textarea className="rating-textarea"
            placeholder="Share your experience to help others..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />

          <button className="modal-pay-btn" style={{ marginTop: 20 }} onClick={onClose} disabled={!rating}>
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Drawer ───────────────────────────────────────────────────────────
function ProfileDrawer({ onClose }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [rateSession, setRateSession] = useState(null);
  const [username, setUsername] = useState("Rohan Verma");
  const [email, setEmail] = useState("rohan.verma@email.com");
  const [phone, setPhone] = useState("+91 98765 43210");

  return (
    <>
      <div className="profile-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="profile-drawer" onClick={e => e.stopPropagation()}>
          <div className="drawer-header">
            <button className="drawer-close" onClick={onClose}><CloseIcon /></button>
            <div className="drawer-avatar">RV</div>
            <div className="drawer-user-name">{username}</div>
            <div className="drawer-user-email">{email}</div>
            <button className="drawer-edit-btn">Edit Photo</button>
          </div>

          <div className="drawer-tabs">
            {[
              { id: "profile", label: "Profile" },
              { id: "history", label: "Sessions" },
              { id: "payments", label: "Payments" },
            ].map(t => (
              <button key={t.id} className={`drawer-tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="drawer-body">
            {activeTab === "profile" && (
              <div>
                <div className="profile-field">
                  <label>Full Name</label>
                  <input className="profile-input" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="profile-field">
                  <label>Email Address</label>
                  <input className="profile-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="profile-field">
                  <label>Phone Number</label>
                  <input className="profile-input" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="profile-field">
                  <label>Username</label>
                  <input className="profile-input" value="@rohan_v" readOnly />
                </div>
                <div className="profile-field">
                  <label>Member Since</label>
                  <input className="profile-input" value="January 2026" readOnly />
                </div>
                <button className="profile-save-btn" onClick={onClose}>Save Changes</button>
              </div>
            )}

            {activeTab === "history" && (
              <div className="history-list">
                {SESSION_HISTORY.map(s => (
                  <div key={s.id} className="history-item">
                    <div className="history-item-top">
                      <span className="history-expert-name">{s.expert}</span>
                      <span className="history-field-tag">{s.field}</span>
                    </div>
                    <div className="history-item-mid">
                      <span className="history-detail"><CalendarIcon /> {s.date}</span>
                      <span className="history-detail"><ClockIcon /> {s.duration}</span>
                    </div>
                    <div className="history-item-bottom">
                      <span className="history-amount">₹{s.amount.toLocaleString()}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className={`history-status ${s.status}`}>
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </span>
                        {s.status === "completed" && !s.rated && (
                          <button className="rate-btn" onClick={() => setRateSession(s)}>Rate</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "payments" && (
              <div>
                <div style={{ background: "linear-gradient(135deg,rgba(0,132,255,0.07),rgba(0,188,212,0.07))", borderRadius: 12, padding: "16px 18px", border: "2px solid rgba(0,188,212,0.12)", marginBottom: 20 }}>
                  <div style={{ fontSize: "0.78rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Total Spent</div>
                  <div style={{ fontSize: "1.7rem", fontWeight: 800, background: "linear-gradient(135deg,#0084ff,#00bcd4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    ₹{PAYMENTS.reduce((s, p) => s + p.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="payments-list">
                  {PAYMENTS.map(p => (
                    <div key={p.id} className="payment-item">
                      <div className="payment-icon"><DollarIcon /></div>
                      <div className="payment-info">
                        <div className="payment-label">{p.label}</div>
                        <div className="payment-date">{p.date}</div>
                      </div>
                      <div className="payment-amount">₹{p.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {rateSession && (
        <RatingModal session={rateSession} onClose={() => setRateSession(null)} />
      )}
    </>
  );
}

// ─── Main UserPage ────────────────────────────────────────────────────────────
export default function UserPage() {
  const [activeView, setActiveView] = useState("experts"); // "experts" | "live"
  const [searchQuery, setSearchQuery] = useState("");
  const [activeField, setActiveField] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [showProfile, setShowProfile] = useState(false);
  const [bookingExpert, setBookingExpert] = useState(null);
  const [connectExpert, setConnectExpert] = useState(null);

  const filteredExperts = useMemo(() => {
    let list = EXPERTS.filter(e => {
      const matchField = activeField === "all" || e.field === activeField;
      const matchSearch = !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.bio.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRating = e.rating >= minRating;
      const matchPrice = e.price <= maxPrice;
      return matchField && matchSearch && matchRating && matchPrice;
    });

    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "sessions") list = [...list].sort((a, b) => b.sessions - a.sessions);

    return list;
  }, [activeField, searchQuery, sortBy, minRating, maxPrice]);

  return (
    <div className="userpage-root">
      {/* ── Top Bar ── */}
      <header className="userpage-topbar">
        <div className="topbar-logo">
          <div className="topbar-logo-icon">C</div>
          <span className="topbar-logo-text">ConsultPro</span>
        </div>

        <div className="topbar-search-wrap">
          <input
            className="topbar-search-input"
            placeholder="Search experts by name, field, or skill..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="topbar-search-btn"><SearchIcon /></button>
        </div>

        <div className="topbar-actions">
          <button
            className={`topbar-tab ${activeView === "experts" ? "active" : ""}`}
            onClick={() => setActiveView("experts")}
          >
            Browse Experts
          </button>
          <button
            className={`topbar-tab live-tab ${activeView === "live" ? "active" : ""}`}
            onClick={() => setActiveView("live")}
          >
            <span className="live-dot" />
            Live Now
          </button>
          <button className="topbar-profile-btn" onClick={() => setShowProfile(true)}>
            RV
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="userpage-body">
        {/* Sidebar */}
        <aside className="userpage-sidebar">
          {/* Field Filter */}
          <div>
            <div className="sidebar-section-title">Field of Expertise</div>
            <div className="filter-group">
              {FIELDS.map(f => (
                <button
                  key={f.id}
                  className={`filter-option ${activeField === f.id ? "active" : ""}`}
                  onClick={() => setActiveField(f.id)}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="sidebar-divider" />

          {/* Sort */}
          <div>
            <div className="sidebar-section-title">Sort By</div>
            <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="sessions">Most Sessions</option>
            </select>
          </div>

          <hr className="sidebar-divider" />

          {/* Rating Filter */}
          <div>
            <div className="sidebar-section-title">Minimum Rating</div>
            <div className="rating-filter">
              {[0, 4, 4.5, 4.8].map(r => (
                <button
                  key={r}
                  className={`rating-option ${minRating === r ? "active" : ""}`}
                  onClick={() => setMinRating(r)}
                >
                  {r === 0 ? "All Ratings" : (
                    <>
                      <div className="stars-display">
                        {[1, 2, 3, 4, 5].map(i => (
                          <svg key={i} viewBox="0 0 24 24" fill={i <= Math.floor(r) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2" width="11" height="11">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      {r}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          <hr className="sidebar-divider" />

          {/* Price Range */}
          <div>
            <div className="sidebar-section-title">Max Price per Session</div>
            <div className="price-range-wrap">
              <input
                type="range" min="300" max="2000" step="100"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="price-range-input"
              />
              <div className="price-range-labels">
                <span>₹300</span>
                <span style={{ fontWeight: 600, color: "#0084ff" }}>Up to ₹{maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="userpage-main">
          {activeView === "experts" && (
            <>
              <div className="section-header">
                <h2 className="section-heading">Expert Consultants</h2>
                <span className="section-count">{filteredExperts.length} expert{filteredExperts.length !== 1 ? "s" : ""} found</span>
              </div>

              {filteredExperts.length === 0 ? (
                <div className="empty-state">
                  <UserIcon />
                  <p>No experts match your current filters. Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="experts-grid">
                  {filteredExperts.map((e, i) => (
                    <ExpertCard key={e.id} expert={e} onBook={setBookingExpert} delay={i * 0.06} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeView === "live" && (
            <>
              <div className="live-section-banner">
                <div className="live-banner-icon"><ShieldIcon /></div>
                <div className="live-banner-text">
                  <h3>Instant Live Consultation</h3>
                  <p>Connect with available experts right now — no booking, no waiting. Pay and start your session immediately via secure video call.</p>
                </div>
              </div>

              <div className="section-header">
                <h2 className="section-heading">Available Now</h2>
                <span className="section-count">{LIVE_EXPERTS.length} expert{LIVE_EXPERTS.length !== 1 ? "s" : ""} online</span>
              </div>

              <div className="live-experts-grid">
                {LIVE_EXPERTS.map((e, i) => (
                  <LiveExpertRow key={e.id} expert={e} onConnect={setConnectExpert} delay={i * 0.07} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* ── Modals ── */}
      {bookingExpert && <BookModal expert={bookingExpert} onClose={() => setBookingExpert(null)} />}
      {connectExpert && <ConnectModal expert={connectExpert} onClose={() => setConnectExpert(null)} />}
      {showProfile && <ProfileDrawer onClose={() => setShowProfile(false)} />}
    </div>
  );
}