import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import EnhancedDashboard from '../../pages/DashboardPage.enhanced';
import EnhancedJobsPage from '../../pages/JobsPage.enhanced';
import EnhancedApplicationsPage from '../../pages/ApplicationsPage.enhanced';
import InterviewsPage from '../../pages/InterviewsPage.modern';
import AnalyticsPage from '../../pages/AnalyticsPage.modern';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="flex-1">
        <Routes>
          <Route index element={<EnhancedDashboard />} />
          <Route path="jobs" element={<EnhancedJobsPage />} />
          <Route path="applications" element={<EnhancedApplicationsPage />} />
          <Route path="interviews" element={<InterviewsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardLayout;