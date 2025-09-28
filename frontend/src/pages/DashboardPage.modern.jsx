import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Briefcase, 
  Calendar, 
  FileText, 
  Users, 
  Clock, 
  ArrowUpRight,
  MapPin,
  Building2,
  Star,
  ChevronRight,
  Plus,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { jobAPI, applicationAPI, studentAPI, recruiterAPI } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentApplications: [],
    recentJobs: [],
    upcomingInterviews: []
  });

  const [timeOfDay] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  });

  const isRecruiter = user?.role === 'RECRUITER' || user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      let stats = {};
      let recentApplications = [];
      let recentJobs = [];

      if (isStudent) {
        // Student dashboard data
        try {
          // Get student profile first
          let studentId = user?.id;
          if (!studentId) {
            const studentResponse = await studentAPI.getByEmail(user.email);
            studentId = studentResponse.data?.id;
          }

          if (studentId) {
            // Get applications
            const applicationsResponse = await applicationAPI.getApplicationsByStudent(studentId);
            recentApplications = applicationsResponse.data || [];
            
            stats = {
              activeApplications: recentApplications.length,
              underReview: recentApplications.filter(app => app.status === 'APPLIED').length,
              shortlisted: recentApplications.filter(app => app.status === 'SHORTLIST').length,
              selected: recentApplications.filter(app => app.status === 'SELECTED').length
            };
          }

          // Get recent jobs for students
          const jobsResponse = await jobAPI.getAllJobs();
          recentJobs = (jobsResponse.data || []).slice(0, 5);

        } catch (error) {
          console.error('Error fetching student data:', error);
        }

      } else if (isRecruiter) {
        // Recruiter dashboard data
        try {
          // Get jobs posted by recruiter
          const jobsResponse = await jobAPI.getJobsByRecruiter(user.email);
          recentJobs = jobsResponse.data || [];

          // Get applications for all jobs
          let allApplications = [];
          for (const job of recentJobs) {
            try {
              const appResponse = await applicationAPI.getApplicationsByJob(job.id);
              allApplications = [...allApplications, ...(appResponse.data || [])];
            } catch (error) {
              console.error('Error fetching applications for job:', job.id, error);
            }
          }
          
          recentApplications = allApplications.slice(0, 5);
          
          stats = {
            activeJobs: recentJobs.length,
            totalApplications: allApplications.length,
            underReview: allApplications.filter(app => app.status === 'APPLIED').length,
            shortlisted: allApplications.filter(app => app.status === 'SHORTLIST').length
          };

        } catch (error) {
          console.error('Error fetching recruiter data:', error);
        }
      }

      setDashboardData({
        stats,
        recentApplications: recentApplications.slice(0, 5),
        recentJobs: recentJobs.slice(0, 5),
        upcomingInterviews: [] // Placeholder for future interview feature
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatsForRole = () => {
    if (isStudent) {
      return [
        {
          title: 'Active Applications',
          value: dashboardData.stats.activeApplications || 0,
          change: '+2.5%',
          changeType: 'increase',
          icon: FileText,
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Under Review',
          value: dashboardData.stats.underReview || 0,
          change: '+5%',
          changeType: 'increase',
          icon: Clock,
          color: 'from-yellow-500 to-yellow-600'
        },
        {
          title: 'Shortlisted',
          value: dashboardData.stats.shortlisted || 0,
          change: '+10%',
          changeType: 'increase',
          icon: Eye,
          color: 'from-green-500 to-green-600'
        },
        {
          title: 'Selected',
          value: dashboardData.stats.selected || 0,
          change: '+25%',
          changeType: 'increase',
          icon: CheckCircle,
          color: 'from-purple-500 to-purple-600'
        }
      ];
    } else {
      return [
        {
          title: 'Active Jobs',
          value: dashboardData.stats.activeJobs || 0,
          change: '+2.1%',
          changeType: 'increase',
          icon: Briefcase,
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Total Applications',
          value: dashboardData.stats.totalApplications || 0,
          change: '+12.5%',
          changeType: 'increase',
          icon: Users,
          color: 'from-green-500 to-green-600'
        },
        {
          title: 'Under Review',
          value: dashboardData.stats.underReview || 0,
          change: '+8%',
          changeType: 'increase',
          icon: Clock,
          color: 'from-yellow-500 to-yellow-600'
        },
        {
          title: 'Shortlisted',
          value: dashboardData.stats.shortlisted || 0,
          change: '+15%',
          changeType: 'increase',
          icon: Eye,
          color: 'from-purple-500 to-purple-600'
        }
      ];
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return <Badge variant="outline" className="text-blue-600">Applied</Badge>;
      case 'SHORTLIST':
        return <Badge variant="outline" className="text-yellow-600">Shortlisted</Badge>;
      case 'SELECTED':
        return <Badge variant="outline" className="text-green-600">Selected</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="text-red-600">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Good {timeOfDay}, {user?.name || user?.email}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {isStudent 
              ? "Here's your job search progress and opportunities."
              : "Here's your recruitment dashboard overview."
            }
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            {isStudent ? 'Find Jobs' : 'Post Job'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatsForRole().map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  <span className="text-green-500">{stat.change}</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications/Applications Received */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {isStudent ? 'Recent Applications' : 'Recent Applications Received'}
              </CardTitle>
              <CardDescription>
                {isStudent 
                  ? 'Your latest job applications'
                  : 'Latest applications for your job posts'
                }
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentApplications.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No applications yet</p>
              </div>
            ) : (
              dashboardData.recentApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {application.jobTitle || 'Job Title N/A'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {isStudent 
                          ? `Applied ${formatDate(application.appliedDate)}`
                          : `${application.studentName} • ${formatDate(application.appliedDate)}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(application.status)}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {isStudent ? 'Recommended Jobs' : 'Your Recent Jobs'}
              </CardTitle>
              <CardDescription>
                {isStudent 
                  ? 'Jobs matching your profile'
                  : 'Your recently posted jobs'
                }
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentJobs.length === 0 ? (
              <div className="text-center py-6">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No jobs available</p>
              </div>
            ) : (
              dashboardData.recentJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {job.title}
                      </p>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{job.location || 'Remote'}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {job.type && <Badge variant="secondary">{job.type}</Badge>}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default DashboardPage;