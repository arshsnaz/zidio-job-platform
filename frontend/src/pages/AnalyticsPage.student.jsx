import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Eye, 
  Calendar,
  Target,
  Award,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  ChevronDown,
  Filter,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../context/AuthContext';
import { applicationAPI, studentAPI, jobAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const StudentAnalytics = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    stats: [],
    applicationTrends: [],
    statusDistribution: [],
    jobTypePreferences: [],
    monthlyActivity: [],
    skillsGap: [],
    industryInterest: []
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe, user]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Get student profile and applications
      let studentId = user?.id;
      let studentProfile = null;
      
      if (!studentId) {
        const studentResponse = await studentAPI.getByEmail(user.email);
        studentProfile = studentResponse.data;
        studentId = studentProfile?.id;
      }

      let applications = [];
      if (studentId) {
        const applicationsResponse = await applicationAPI.getApplicationsByStudent(studentId);
        applications = applicationsResponse.data || [];
      }

      // Get all jobs for analysis
      const jobsResponse = await jobAPI.getAllJobs();
      const allJobs = jobsResponse.data || [];

      // Calculate stats
      const stats = [
        {
          title: 'Total Applications',
          value: applications.length.toString(),
          change: calculateChange(applications, 'total'),
          changeType: 'increase',
          icon: Briefcase,
          color: 'from-blue-500 to-blue-600',
          description: 'Jobs you\'ve applied to'
        },
        {
          title: 'Success Rate',
          value: `${calculateSuccessRate(applications)}%`,
          change: '+2.1%',
          changeType: 'increase',
          icon: Target,
          color: 'from-green-500 to-green-600',
          description: 'Applications leading to interviews'
        },
        {
          title: 'Avg. Response Time',
          value: '3.2 days',
          change: '-0.5 days',
          changeType: 'increase',
          icon: Clock,
          color: 'from-purple-500 to-purple-600',
          description: 'Average employer response time'
        },
        {
          title: 'Profile Score',
          value: calculateProfileScore(studentProfile, user),
          change: '+12 pts',
          changeType: 'increase',
          icon: Award,
          color: 'from-orange-500 to-orange-600',
          description: 'Based on profile completeness'
        }
      ];

      // Application trends over time
      const applicationTrends = generateApplicationTrends(applications);
      
      // Status distribution
      const statusDistribution = generateStatusDistribution(applications);
      
      // Job type preferences based on applications
      const jobTypePreferences = generateJobTypePreferences(applications, allJobs);
      
      // Monthly activity
      const monthlyActivity = generateMonthlyActivity(applications);
      
      // Skills gap analysis (mock data for now)
      const skillsGap = [
        { skill: 'React.js', demand: 85, yourLevel: 60 },
        { skill: 'Python', demand: 75, yourLevel: 70 },
        { skill: 'Node.js', demand: 70, yourLevel: 45 },
        { skill: 'AWS', demand: 80, yourLevel: 30 },
        { skill: 'Docker', demand: 65, yourLevel: 25 }
      ];
      
      // Industry interest based on applications
      const industryInterest = generateIndustryInterest(applications, allJobs);

      setAnalyticsData({
        stats,
        applicationTrends,
        statusDistribution,
        jobTypePreferences,
        monthlyActivity,
        skillsGap,
        industryInterest
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (applications, type) => {
    // Mock calculation - in real app, compare with previous period
    const change = Math.floor(Math.random() * 20) - 5;
    return change >= 0 ? `+${change}%` : `${change}%`;
  };

  const calculateSuccessRate = (applications) => {
    if (applications.length === 0) return 0;
    const successful = applications.filter(app => 
      app.status === 'SELECTED' || app.status === 'SHORTLIST'
    ).length;
    return Math.round((successful / applications.length) * 100);
  };

  const calculateProfileScore = (profile, user) => {
    let score = 0;
    if (user?.email) score += 20;
    if (user?.firstName && user?.lastName) score += 20;
    if (profile?.skills) score += 30;
    if (profile?.education) score += 20;
    if (profile?.resumeUrl) score += 10;
    return `${score}/100`;
  };

  const generateApplicationTrends = (applications) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applications: Math.floor(Math.random() * 5),
        responses: Math.floor(Math.random() * 3)
      };
    });
    return last7Days;
  };

  const generateStatusDistribution = (applications) => {
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: Math.round((count / applications.length) * 100)
    }));
  };

  const generateJobTypePreferences = (applications, allJobs) => {
    const preferences = {};
    applications.forEach(app => {
      const job = allJobs.find(j => j.id === app.jobId);
      if (job?.type) {
        preferences[job.type] = (preferences[job.type] || 0) + 1;
      }
    });

    return Object.entries(preferences).map(([type, count]) => ({
      type,
      applications: count,
      percentage: Math.round((count / applications.length) * 100)
    }));
  };

  const generateMonthlyActivity = (applications) => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        applications: Math.floor(Math.random() * 15) + 5,
        interviews: Math.floor(Math.random() * 5),
        offers: Math.floor(Math.random() * 2)
      };
    });
    return last6Months;
  };

  const generateIndustryInterest = (applications, allJobs) => {
    // Mock data - in real app, analyze job descriptions and company info
    return [
      { industry: 'Technology', interest: 85, jobs: 45 },
      { industry: 'Finance', interest: 60, jobs: 25 },
      { industry: 'Healthcare', interest: 40, jobs: 15 },
      { industry: 'Education', interest: 30, jobs: 10 },
      { industry: 'Retail', interest: 25, jobs: 8 }
    ];
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Career Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track your job search progress and insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsData.stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        {stat.title}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        <Badge
                          variant={stat.changeType === 'increase' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {stat.change}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Application Activity
              </CardTitle>
              <CardDescription>Your job search activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.applicationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="responses"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Application Status
              </CardTitle>
              <CardDescription>Distribution of your application statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Monthly Progress
              </CardTitle>
              <CardDescription>Applications, interviews, and offers by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="applications" fill="#3B82F6" name="Applications" />
                    <Bar dataKey="interviews" fill="#10B981" name="Interviews" />
                    <Bar dataKey="offers" fill="#F59E0B" name="Offers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills Gap Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Skills Gap Analysis
              </CardTitle>
              <CardDescription>Market demand vs your current skill level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.skillsGap.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.skill}</span>
                      <span className="text-xs text-muted-foreground">
                        {skill.yourLevel}% / {skill.demand}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full relative"
                          style={{ width: `${skill.demand}%` }}
                        >
                          <div 
                            className="absolute top-0 bg-green-500 h-2 rounded-full"
                            style={{ width: `${(skill.yourLevel / skill.demand) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Industry Interest */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Industry Analysis
            </CardTitle>
            <CardDescription>Your interest and job availability by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.industryInterest} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="industry" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="interest" fill="#3B82F6" name="Interest %" />
                  <Bar dataKey="jobs" fill="#10B981" name="Available Jobs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Based on your analytics, here's what you should focus on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Skill Development</h4>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Focus on AWS and Docker skills to match market demand
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">Application Strategy</h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your success rate is good - apply to 3-5 jobs per week
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-orange-600" />
                  <h4 className="font-medium text-orange-900 dark:text-orange-100">Profile Enhancement</h4>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Complete your resume and add more project details
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default StudentAnalytics;