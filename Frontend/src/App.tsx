import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router'
import Home from './pages/Home/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Profile from './pages/Profile/Profile'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/:username" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
