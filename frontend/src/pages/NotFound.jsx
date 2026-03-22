import { useNavigate } from 'react-router-dom'
import '../styles/NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  )
}
