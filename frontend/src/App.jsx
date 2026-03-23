import { Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage'
import ExpertDashboardDemo from './pages/ExpertDashboardDemo'
import ConsulteeDashboard from './pages/ConsulteeDashboardDemo'
import ExpertDashboard from "./pages/ExpertDashboard";
import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/expert" element={<ExpertDashboardDemo />} />
      <Route path="/consultee" element={<ConsulteeDashboard />} />
      <Route path="*" element={<Signup />} />
      <Route path="/Signup" element={<Signup />} />
      { <Route path="/Login" element={<Login />} /> }
      <Route path="/expert-dashboard" element={<ExpertDashboard />} />
    </Routes>
  )
}

export default App
