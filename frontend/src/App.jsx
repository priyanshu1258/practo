import { Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage'
import ExpertDashboard from './pages/ExpertDashboard'
import ConsulteeDashboard from './pages/ConsulteeDashboard'

import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/expert" element={<ExpertDashboard />} />
      <Route path="/consultee" element={<ConsulteeDashboard />} />
      <Route path="*" element={<Signup />} />
      <Route path="/Signup" element={<Signup />} />
      { <Route path="/Login" element={<Login />} /> }
    </Routes>
  )
}

export default App
