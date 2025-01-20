import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router'
import Home from './pages/Home/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Profile from './pages/Profile/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
