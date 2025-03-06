import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import ChatPage from './pages/Chat/ChatPage';
import FriendsPage from './pages/Friends/FriendsPage';
import { UserProvider } from './context/UserContext';
import styled from 'styled-components';

const MainContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: white;
`;

const TransitionContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  overflow-x: hidden;
`;

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <TransitionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        type: "tween",
        ease: "easeInOut",
        duration: 0.8
      }}
    >
      {children}
    </TransitionContainer>
  );
};

function App() {
  const location = useLocation();

  return (
    <UserProvider>
      <MainContainer>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PageTransition>
                  <Register />
                </PageTransition>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/:username" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/friends" 
              element={
                <ProtectedRoute>
                  <FriendsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AnimatePresence>
      </MainContainer>
    </UserProvider>
  );
}

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
