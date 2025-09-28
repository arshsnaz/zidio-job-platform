import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Theme and Context
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './context/AuthContext';

// Components
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout.enhanced';

// Professional Pages
import MainPage from './pages/MainPage';
import LandingPage from './pages/LandingPage.professional';
import LoginPage from './pages/LoginPage.professional';
import RegisterPage from './pages/RegisterPage';

// Enhanced Pages
import EnhancedDashboard from './pages/DashboardPage.enhanced';
import EnhancedJobsPage from './pages/JobsPage.enhanced';
import EnhancedApplicationsPage from './pages/ApplicationsPage.enhanced';

// Student Pages
import StudentDashboard from './pages/DashboardPage.student';
import StudentJobsPage from './pages/JobsPage.student';
import StudentApplicationsPage from './pages/ApplicationsPage.student';
import StudentInterviewsPage from './pages/InterviewsPage.student';
import StudentAnalytics from './pages/AnalyticsPage.student';

// Original Pages (for recruiters/admins)
import ProfessionalDashboard from './pages/DashboardPage.professional';
import JobsPage from './pages/JobsPage.modern';
import ApplicationsPage from './pages/ApplicationsPage.modern';
import InterviewsPage from './pages/InterviewsPage.modern';
import AnalyticsPage from './pages/AnalyticsPage.modern';

import UnauthorizedPage from './pages/UnauthorizedPage';
import { useAuth } from './context/AuthContext';

// Role-based component wrapper
const RoleBasedComponent = ({ studentComponent: StudentComponent, defaultComponent: DefaultComponent, ...props }) => {
  const { user } = useAuth();
  
  if (user?.role === 'STUDENT') {
    return <StudentComponent {...props} />;
  }
  
  return <DefaultComponent {...props} />;
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="zidio-ui-theme">
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground antialiased">
          <Router>
            <Routes>
              {/* Main Landing Page */}
              <Route path="/" element={<MainPage />} />

              {/* Public Routes */}
              <Route path="/jobs" element={<EnhancedJobsPage />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />

              {/* Protected Routes with Dashboard Layout */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route 
                  index 
                  element={
                    <RoleBasedComponent 
                      studentComponent={EnhancedDashboard} 
                      defaultComponent={EnhancedDashboard} 
                    />
                  } 
                />
                <Route 
                  path="jobs" 
                  element={
                    <RoleBasedComponent 
                      studentComponent={EnhancedJobsPage} 
                      defaultComponent={EnhancedJobsPage} 
                    />
                  } 
                />
                <Route 
                  path="applications" 
                  element={
                    <RoleBasedComponent 
                      studentComponent={EnhancedApplicationsPage} 
                      defaultComponent={EnhancedApplicationsPage} 
                    />
                  } 
                />
                <Route 
                  path="interviews" 
                  element={
                    <RoleBasedComponent 
                      studentComponent={StudentInterviewsPage} 
                      defaultComponent={InterviewsPage} 
                    />
                  } 
                />
                <Route 
                  path="analytics" 
                  element={
                    <RoleBasedComponent 
                      studentComponent={StudentAnalytics} 
                      defaultComponent={AnalyticsPage} 
                    />
                  } 
                />
                {/* <Route path="profile" element={<ProfilePage />} /> */}
                <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings Page - Coming Soon</h1></div>} />
              </Route>

              {/* Unauthorized Route */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Catch all route - redirect to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
