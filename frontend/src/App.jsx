import { Routes, Route } from 'react-router-dom'
import Homepage from './components/Homepage'
import ExpertDashboard from './pages/ExpertDashboard'
import ConsulteeDashboard from './pages/ConsulteeDashboard'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/expert" element={<ExpertDashboard />} />
      <Route path="/consultee" element={<ConsulteeDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
