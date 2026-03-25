import { Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage'
import ExpertDashboard from './pages/ExpertDashboard'
import ConsulteeDashboard from './pages/userPage'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/expert" element={<ExpertDashboard />} />
      <Route path="/consultee" element={<ConsulteeDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App