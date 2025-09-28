import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context and Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './components/theme-provider';

// Components
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Pages - Modern versions
import LoginPage from './pages/LoginPage.modern';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import InterviewsPage from './pages/InterviewsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="zidio-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <JobsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ApplicationsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/interviews"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <InterviewsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYER']}>
                    <DashboardLayout>
                      <AnalyticsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              className="!z-[9999]"
              toastClassName="!rounded-xl !shadow-lg"
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;