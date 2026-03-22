import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/Dashboard.css'

export default function ExpertDashboard() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h1 className="dashboard-title">Expert Dashboard</h1>
          <p className="dashboard-subtitle">Manage your sessions and consultations</p>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">📅</div>
              <h3>Upcoming Sessions</h3>
              <p>View and manage your scheduled consultations</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">💰</div>
              <h3>Earnings</h3>
              <p>Track your income and payments</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">⭐</div>
              <h3>Reviews</h3>
              <p>See feedback from your consultees</p>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">⚙️</div>
              <h3>Settings</h3>
              <p>Update your profile and preferences</p>
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
