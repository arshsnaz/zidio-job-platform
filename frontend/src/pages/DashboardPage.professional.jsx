import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  MapPin,
  Building2,
  Star,
  ArrowRight,
  Eye,
  Heart,
  MessageSquare,
  Award,
  Target,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalInterviews: 0,
    activeJobs: 0
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardStats();
    fetchRecentActivity();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setStats({
        totalJobs: 1234,
        totalApplications: 89,
        totalInterviews: 12,
        activeJobs: 456
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Mock data - replace with actual API calls
      setRecentJobs([
        {
          id: 1,
          title: 'Senior Frontend Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          type: 'Full-time',
          salary: '$120,000 - $150,000',
          posted: '2 hours ago',
          applicants: 23,
          logo: '🚀'
        },
        {
          id: 2,
          title: 'Product Manager',
          company: 'Innovation Labs',
          location: 'New York, NY',
          type: 'Full-time',
          salary: '$100,000 - $130,000',
          posted: '4 hours ago',
          applicants: 15,
          logo: '💡'
        },
        {
          id: 3,
          title: 'UX/UI Designer',
          company: 'Design Studio',
          location: 'Remote',
          type: 'Contract',
          salary: '$80,000 - $100,000',
          posted: '6 hours ago',
          applicants: 31,
          logo: '🎨'
        }
      ]);

      setRecentApplications([
        {
          id: 1,
          jobTitle: 'Software Engineer',
          company: 'Google',
          status: 'Under Review',
          appliedDate: '2024-01-15',
          statusColor: 'bg-blue-100 text-blue-800'
        },
        {
          id: 2,
          jobTitle: 'Frontend Developer',
          company: 'Facebook',
          status: 'Interview Scheduled',
          appliedDate: '2024-01-14',
          statusColor: 'bg-green-100 text-green-800'
        }
      ]);

      setUpcomingInterviews([
        {
          id: 1,
          jobTitle: 'Senior Developer',
          company: 'Microsoft',
          date: '2024-01-20',
          time: '10:00 AM',
          type: 'Video Call',
          interviewer: 'John Smith'
        }
      ]);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserRoleColor = () => {
    const roleColors = {
      STUDENT: 'from-blue-500 to-indigo-600',
      RECRUITER: 'from-emerald-500 to-teal-600',
      ADMIN: 'from-violet-500 to-purple-600'
    };
    return roleColors[user?.role] || roleColors.STUDENT;
  };

  const getDashboardStats = () => {
    if (user?.role === 'STUDENT') {
      return [
        { icon: Eye, label: 'Profile Views', value: '342', color: 'from-blue-500 to-blue-600', change: '+12%' },
        { icon: FileText, label: 'Applications', value: stats.totalApplications, color: 'from-emerald-500 to-emerald-600', change: '+8%' },
        { icon: Calendar, label: 'Interviews', value: stats.totalInterviews, color: 'from-violet-500 to-violet-600', change: '+25%' },
        { icon: Heart, label: 'Saved Jobs', value: '28', color: 'from-rose-500 to-rose-600', change: '+5%' }
      ];
    } else if (user?.role === 'RECRUITER') {
      return [
        { icon: Briefcase, label: 'Active Jobs', value: stats.activeJobs, color: 'from-blue-500 to-blue-600', change: '+15%' },
        { icon: Users, label: 'Total Applications', value: stats.totalApplications, color: 'from-emerald-500 to-emerald-600', change: '+12%' },
        { icon: Calendar, label: 'Interviews Scheduled', value: stats.totalInterviews, color: 'from-violet-500 to-violet-600', change: '+8%' },
        { icon: CheckCircle, label: 'Successful Hires', value: '45', color: 'from-green-500 to-green-600', change: '+20%' }
      ];
    } else {
      return [
        { icon: Users, label: 'Total Users', value: '10,234', color: 'from-blue-500 to-blue-600', change: '+18%' },
        { icon: Building2, label: 'Companies', value: '1,200', color: 'from-emerald-500 to-emerald-600', change: '+12%' },
        { icon: Briefcase, label: 'Total Jobs', value: stats.totalJobs, color: 'from-violet-500 to-violet-600', change: '+25%' },
        { icon: TrendingUp, label: 'Success Rate', value: '92%', color: 'from-orange-500 to-orange-600', change: '+3%' }
      ];
    }
  };

  const dashboardStats = getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${getUserRoleColor()} rounded-2xl p-8 text-white relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {getGreeting()}, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-lg opacity-90 mb-4">
                {user?.role === 'STUDENT' && "Ready to find your next opportunity?"}
                {user?.role === 'RECRUITER' && "Let's find the perfect candidates today!"}
                {user?.role === 'ADMIN' && "Manage your platform efficiently."}
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">{user?.role || 'User'}</span>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">
                    Member since {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <div className="text-6xl">
                  {user?.role === 'STUDENT' && '🎓'}
                  {user?.role === 'RECRUITER' && '💼'}
                  {user?.role === 'ADMIN' && '⚡'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Jobs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {user?.role === 'STUDENT' ? 'Recommended Jobs' : 'Recent Job Postings'}
                </h2>
                <Link
                  to="/jobs"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 text-sm"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {recentJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold">
                    {job.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {job.company} • {job.location}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                        {job.type}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {job.posted}
                    </p>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">
                      {job.applicants} applicants
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions & Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {user?.role === 'STUDENT' && (
                <>
                  <Link
                    to="/jobs"
                    className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group"
                  >
                    <Briefcase className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Browse Jobs</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors group"
                  >
                    <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Update Profile</span>
                  </Link>
                </>
              )}
              {user?.role === 'RECRUITER' && (
                <>
                  <Link
                    to="/jobs/create"
                    className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group"
                  >
                    <Briefcase className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Post New Job</span>
                  </Link>
                  <Link
                    to="/applications"
                    className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors group"
                  >
                    <FileText className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Review Applications</span>
                  </Link>
                </>
              )}
              <Link
                to="/interviews"
                className="flex items-center space-x-3 p-3 bg-violet-50 dark:bg-violet-900/20 text-violet-600 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors group"
              >
                <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Schedule Interview</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {recentApplications.map((application, index) => (
                <div
                  key={application.id}
                  className="flex items-center space-x-3"
                >
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {application.jobTitle}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      at {application.company}
                    </p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${application.statusColor}`}>
                    {application.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;