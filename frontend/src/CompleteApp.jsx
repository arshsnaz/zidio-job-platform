import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Provider
import { AuthProvider } from './context/AuthContext';

// Pages
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage.professional';
import RegisterPage from './pages/RegisterPage';
import EnhancedJobsPage from './pages/JobsPage.enhanced';

// Protected Route wrapper
import { ProtectedRoute } from './components/ProtectedRoute';

// Dashboard components
import EnhancedDashboard from './pages/DashboardPage.enhanced';
import EnhancedApplicationsPage from './pages/ApplicationsPage.enhanced';
import InterviewsPage from './pages/InterviewsPage.modern';

const CompleteApp = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainPage />} />
            <Route path="/jobs" element={<EnhancedJobsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <EnhancedDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications" 
              element={
                <ProtectedRoute>
                  <EnhancedApplicationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/interviews" 
              element={
                <ProtectedRoute>
                  <InterviewsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default CompleteApp;