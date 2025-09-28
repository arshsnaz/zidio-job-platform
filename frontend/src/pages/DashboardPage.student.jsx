import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Briefcase, 
  Calendar, 
  FileText, 
  Clock, 
  ArrowUpRight,
  MapPin,
  Building2,
  Star,
  ChevronRight,
  Eye,
  CheckCircle,
  AlertCircle,
  Users,
  BookOpen,
  Target,
  Award,
  Bell,
  PlusCircle,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { jobAPI, applicationAPI, studentAPI } from '../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentApplications: [],
    recommendedJobs: [],
    upcomingInterviews: [],
    profileCompleteness: 0,
    skillsToImprove: [],
    achievements: []
  });

  const [timeOfDay] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      let stats = {
        totalApplications: 0,
        pendingApplications: 0,
        shortlisted: 0,
        selected: 0,
        profileViews: 0,
        savedJobs: 0
      };
      let recentApplications = [];
      let recommendedJobs = [];
      let studentProfile = null;

      // Get student profile first
      let studentId = user?.id;
      if (!studentId && user?.email) {
        try {
          const studentResponse = await studentAPI.getByEmail(user.email);
          studentProfile = studentResponse.data;
          studentId = studentProfile?.id;
        } catch (error) {
          console.error('Error fetching student profile:', error);
        }
      }

      if (studentId) {
        try {
          // Get applications
          const applicationsResponse = await applicationAPI.getApplicationsByStudent(studentId);
          recentApplications = (applicationsResponse.data || []).slice(0, 5);
          
          stats = {
            totalApplications: recentApplications.length,
            pendingApplications: recentApplications.filter(app => app.status === 'APPLIED').length,
            shortlisted: recentApplications.filter(app => app.status === 'SHORTLIST').length,
            selected: recentApplications.filter(app => app.status === 'SELECTED').length,
            profileViews: studentProfile?.profileViews || 0,
            savedJobs: studentProfile?.savedJobs?.length || 0
          };
        } catch (error) {
          console.error('Error fetching applications:', error);
        }
      }

      try {
        // Get recommended jobs
        const jobsResponse = await jobAPI.getAllJobs();
        const allJobs = jobsResponse.data || [];
        
        // Filter jobs based on student's skills/interests if available
        const appliedJobIds = recentApplications.map(app => app.jobId);
        recommendedJobs = allJobs
          .filter(job => !appliedJobIds.includes(job.id))
          .slice(0, 4);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }

      // Calculate profile completeness
      const profileCompleteness = calculateProfileCompleteness(studentProfile, user);

      // Generate achievements based on actual data
      const achievements = [
        { title: 'Profile Creator', description: 'Created your first profile', completed: !!studentProfile },
        { title: 'First Application', description: 'Applied to your first job', completed: recentApplications.length > 0 },
        { title: 'Active Seeker', description: 'Applied to 5+ jobs', completed: recentApplications.length >= 5 },
        { title: 'Profile Complete', description: 'Complete your profile 100%', completed: profileCompleteness >= 100 }
      ];

      const skillsToImprove = studentProfile?.skillsToImprove || [
        'React.js', 'Node.js', 'Python', 'Data Analysis', 'Project Management'
      ];

      setDashboardData({
        stats,
        recentApplications,
        recommendedJobs,
        upcomingInterviews: [], // Will be populated from interviews API
        profileCompleteness,
        skillsToImprove,
        achievements
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompleteness = (studentProfile, user) => {
    let completeness = 0;
    const fields = [
      { field: 'email', value: user?.email, weight: 15 },
      { field: 'name', value: user?.firstName || user?.lastName, weight: 15 },
      { field: 'skills', value: studentProfile?.skills, weight: 25 },
      { field: 'education', value: studentProfile?.education, weight: 20 },
      { field: 'resume', value: studentProfile?.resumeUrl, weight: 25 }
    ];

    fields.forEach(({ value, weight }) => {
      if (value) completeness += weight;
    });

    return Math.min(completeness, 100);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPLIED':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'SHORTLIST':
        return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'SELECTED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SHORTLIST':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'SELECTED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            Good {timeOfDay}, {user?.firstName || user?.name || 'there'}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Ready to take the next step in your career journey?
          </p>
        </motion.div>
      </div>

      {/* Profile Completeness Card */}
      {dashboardData.profileCompleteness < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-lg text-orange-900 dark:text-orange-100">
                    Complete Your Profile
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  {dashboardData.profileCompleteness}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={dashboardData.profileCompleteness} className="mb-3" />
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                A complete profile gets 3x more views from recruiters
              </p>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{dashboardData.stats.totalApplications || 0}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+2 this week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{dashboardData.stats.pendingApplications || 0}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Shortlisted</p>
                <p className="text-2xl font-bold">{dashboardData.stats.shortlisted || 0}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{dashboardData.stats.profileViews || 0}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+12% from last week</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Applications & Jobs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Recent Applications
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <span>View all</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.recentApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No applications yet</p>
                    <Button size="sm" className="mt-2">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Apply to Jobs
                    </Button>
                  </div>
                ) : (
                  dashboardData.recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{application.jobTitle}</p>
                          <p className="text-sm text-gray-600">{formatDate(application.appliedDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(application.status)} size="sm">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            <span>{application.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended Jobs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Jobs For You
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <span>See more</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.recommendedJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{job.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4" />
                          <span>{job.companyName}</span>
                          <MapPin className="w-4 h-4 ml-2" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">
                          {job.stipend}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(job.createdAt)}
                        </span>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Achievements & Skills */}
        <div className="space-y-6">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`font-medium ${achievement.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {achievement.title}
                      </p>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills to Improve */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Skills to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {dashboardData.skillsToImprove.map((skill) => (
                    <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-gray-100">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="mt-3 w-full">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Skills
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Update Resume
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Network
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Job Alerts
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;