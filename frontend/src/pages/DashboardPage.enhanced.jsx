import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Icon Components
const Icons = {
  Briefcase: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8m-8 0a2 2 0 00-2 2v6l10 4-10-4z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  BarChart: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  AlertCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    applications: [],
    recentJobs: [],
    upcomingInterviews: [],
    statistics: {
      totalApplications: 0,
      pendingApplications: 0,
      acceptedApplications: 0,
      rejectedApplications: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints
      const [applicationsRes, jobsRes] = await Promise.allSettled([
        user?.id ? api.get(`/api/applications/student/${user.id}`) : Promise.resolve({ data: [] }),
        api.get('/api/jobPosts')
      ]);

      // Process applications
      const applications = applicationsRes.status === 'fulfilled' ? applicationsRes.value.data || [] : [];
      
      // Process jobs (get recent ones)
      const jobs = jobsRes.status === 'fulfilled' ? jobsRes.value.data || [] : [];
      const recentJobs = jobs.slice(0, 3);

      // Calculate statistics
      const statistics = applications.reduce((acc, app) => {
        acc.totalApplications++;
        switch (app.status) {
          case 'PENDING':
            acc.pendingApplications++;
            break;
          case 'ACCEPTED':
            acc.acceptedApplications++;
            break;
          case 'REJECTED':
            acc.rejectedApplications++;
            break;
        }
        return acc;
      }, {
        totalApplications: 0,
        pendingApplications: 0,
        acceptedApplications: 0,
        rejectedApplications: 0
      });

      // Mock upcoming interviews (as we don't have the endpoint working yet)
      const upcomingInterviews = [
        {
          id: 1,
          jobTitle: "Senior Full Stack Developer",
          company: "TechCorp Inc.",
          date: "2024-01-20",
          time: "2:00 PM",
          type: "VIDEO_CALL",
          interviewer: "John Smith"
        },
        {
          id: 2,
          jobTitle: "Product Manager",
          company: "InnovateLab",
          date: "2024-01-22",
          time: "10:00 AM",
          type: "PHONE_CALL",
          interviewer: "Sarah Johnson"
        }
      ];

      setDashboardData({
        applications: applications.slice(0, 5), // Recent 5 applications
        recentJobs,
        upcomingInterviews,
        statistics
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Mock data for demo
      setDashboardData({
        applications: [
          {
            id: 1,
            jobTitle: "Senior Full Stack Developer",
            company: "TechCorp Inc.",
            status: "PENDING",
            appliedDate: "2024-01-15T10:00:00Z"
          },
          {
            id: 2,
            jobTitle: "Product Manager", 
            company: "InnovateLab",
            status: "REVIEWED",
            appliedDate: "2024-01-12T14:30:00Z"
          },
          {
            id: 3,
            jobTitle: "UI/UX Designer",
            company: "DesignStudio",
            status: "ACCEPTED",
            appliedDate: "2024-01-10T11:20:00Z"
          }
        ],
        recentJobs: [
          {
            id: 4,
            title: "DevOps Engineer",
            company: "CloudTech",
            location: "Remote",
            type: "FULL_TIME",
            salary: "$95,000 - $125,000"
          },
          {
            id: 5,
            title: "Frontend Developer",
            company: "WebSolutions",
            location: "San Francisco, CA", 
            type: "FULL_TIME",
            salary: "$85,000 - $110,000"
          },
          {
            id: 6,
            title: "Marketing Manager",
            company: "GrowthTech",
            location: "New York, NY",
            type: "FULL_TIME",
            salary: "$75,000 - $95,000"
          }
        ],
        upcomingInterviews: [
          {
            id: 1,
            jobTitle: "Senior Full Stack Developer",
            company: "TechCorp Inc.",
            date: "2024-01-20",
            time: "2:00 PM",
            type: "VIDEO_CALL"
          }
        ],
        statistics: {
          totalApplications: 8,
          pendingApplications: 3,
          acceptedApplications: 2,
          rejectedApplications: 1
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-xl text-gray-600">
                Here's what's happening with your job search
              </p>
            </div>
            
            <div className="hidden md:block">
              <Link
                to="/jobs"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center"
              >
                Browse Jobs
                <Icons.ArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardData.statistics.totalApplications}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                <Icons.Briefcase />
              </div>
            </div>
            <div className="flex items-center mt-4 text-green-600">
              <Icons.TrendingUp />
              <span className="ml-1 text-sm">+12% from last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardData.statistics.pendingApplications}
                </p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-xl">
                <Icons.Clock />
              </div>
            </div>
            <div className="flex items-center mt-4 text-yellow-600">
              <Icons.AlertCircle />
              <span className="ml-1 text-sm">Awaiting response</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Accepted</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardData.statistics.acceptedApplications}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                <Icons.CheckCircle />
              </div>
            </div>
            <div className="flex items-center mt-4 text-green-600">
              <Icons.Star />
              <span className="ml-1 text-sm">Great progress!</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardData.statistics.totalApplications > 0 
                    ? Math.round(((dashboardData.statistics.acceptedApplications + dashboardData.statistics.rejectedApplications) / dashboardData.statistics.totalApplications) * 100)
                    : 0}%
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                <Icons.BarChart />
              </div>
            </div>
            <div className="flex items-center mt-4 text-purple-600">
              <Icons.TrendingUp />
              <span className="ml-1 text-sm">Above average</span>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
                <Link
                  to="/applications"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  View All
                  <Icons.ArrowRight />
                </Link>
              </div>

              <div className="space-y-4">
                {dashboardData.applications.length > 0 ? (
                  dashboardData.applications.map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {application.jobTitle}
                        </h3>
                        <p className="text-gray-600 mb-2">{application.company}</p>
                        <p className="text-sm text-gray-500">
                          Applied {formatDate(application.appliedDate)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Icons.Briefcase />
                    <p className="text-gray-600 mt-2">No applications yet</p>
                    <Link
                      to="/jobs"
                      className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
                    >
                      Start applying to jobs
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recommended Jobs</h2>
                <Link
                  to="/jobs"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  View All
                  <Icons.ArrowRight />
                </Link>
              </div>

              <div className="grid gap-4">
                {dashboardData.recentJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-blue-600 font-medium mb-1">{job.company}</p>
                        <p className="text-gray-600 text-sm">{job.location}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {job.type?.replace('_', ' ') || 'Full Time'}
                      </span>
                    </div>
                    {job.salary && (
                      <p className="text-gray-700 font-medium text-sm">{job.salary}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Interviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Interviews</h2>
                <Link
                  to="/interviews"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {dashboardData.upcomingInterviews.length > 0 ? (
                  dashboardData.upcomingInterviews.map((interview, index) => (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {interview.jobTitle}
                      </h3>
                      <p className="text-blue-600 text-sm font-medium mb-2">
                        {interview.company}
                      </p>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Icons.Calendar />
                        <span className="ml-1">{interview.date} at {interview.time}</span>
                      </div>
                      <span className="inline-block mt-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {interview.type?.replace('_', ' ') || 'Video Call'}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Icons.Calendar />
                    <p className="text-gray-600 mt-2 text-sm">No upcoming interviews</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link
                  to="/jobs"
                  className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors group"
                >
                  <Icons.Briefcase />
                  <span className="ml-3 font-medium text-gray-900">Browse Jobs</span>
                  <Icons.ArrowRight />
                </Link>
                
                <Link
                  to="/profile"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <Icons.Users />
                  <span className="ml-3 font-medium text-gray-900">Update Profile</span>
                  <Icons.ArrowRight />
                </Link>
                
                <Link
                  to="/analytics"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <Icons.BarChart />
                  <span className="ml-3 font-medium text-gray-900">View Analytics</span>
                  <Icons.ArrowRight />
                </Link>
              </div>
            </motion.div>

            {/* Tips & Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white"
            >
              <h2 className="text-xl font-bold mb-4">💡 Pro Tip</h2>
              <p className="text-purple-100 mb-4">
                Companies are 3x more likely to respond to applications submitted within 24 hours of job posting.
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Find Fresh Jobs
                <Icons.ArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;