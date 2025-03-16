import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LifeLineNavigation from './components/LifeLineNavigation'; // Your dashboard component
import AuthPage from './components/AuthPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('userId'); // Check if user is logged in
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* AuthPage as the default route */}
          <Route path="/" element={<AuthPage />} />
          
          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LifeLineNavigation />
              </ProtectedRoute>
            }
          />
          
          {/* Redirect any unknown routes to AuthPage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;