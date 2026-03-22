import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/Dashboard.css'

export default function ConsulteeDashboard() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h1 className="dashboard-title">Consultee Dashboard</h1>
          <p className="dashboard-subtitle">Explore experts and book sessions</p>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">🔍</div>
              <h3>Find Experts</h3>
              <p>Browse and search for professionals</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">📖</div>
              <h3>My Bookings</h3>
              <p>View your scheduled consultations</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">💬</div>
              <h3>Messages</h3>
              <p>Chat with your experts</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">❤️</div>
              <h3>Favorites</h3>
              <p>Save your preferred experts</p>
            </div>
          </div>

          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </>
  )
}
