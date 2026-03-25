import { Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage'
import ExpertDashboardDemo from './pages/ExpertDashboardDemo'
import ConsulteeDashboard from './pages/ConsulteeDashboardDemo'
import ExpertDashboard from "./pages/ExpertDashboard";
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserPage from './pages/userPage'

function App() {
  return (
    <Routes>
  <Route path="/" element={<Homepage />} />
  
  <Route path="/Signup" element={<Signup />} />
  <Route path="/Login" element={<Login />} />

  <Route path="/expert-dashboard" element={<ExpertDashboard />} />
  <Route path="/userPage" element={<UserPage />} />

  {/* optional demo routes */}
  <Route path="/expert" element={<ExpertDashboardDemo />} />
  <Route path="/consultee" element={<ConsulteeDashboard />} />

  {/* keep wildcard LAST */}
  <Route path="*" element={<Signup />} />
</Routes>
  )
}

export default App