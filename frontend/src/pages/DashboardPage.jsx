import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Work,
  Assignment,
  Schedule,
  People,
  Visibility,
  ArrowForward,
  Notifications,
  CalendarToday,
  Business,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { userAPI, analyticsAPI } from '../services/api';

// Stats Card Component
function StatsCard({ title, value, icon, color, trend, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card
        onClick={onClick}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          border: `1px solid ${color}20`,
          '&:hover': onClick ? {
            boxShadow: `0 8px 25px ${color}25`,
          } : {},
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" gutterBottom variant="body2">
                {title}
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {value}
              </Typography>
              {trend && (
                <Box display="flex" alignItems="center" mt={1}>
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  <Typography variant="body2" color="success.main">
                    {trend}
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar
              sx={{
                bgcolor: color,
                width: 56,
                height: 56,
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Recent Activity Component
function RecentActivity({ activities }) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Recent Activity
          </Typography>
          <Button endIcon={<ArrowForward />} size="small">
            View All
          </Button>
        </Box>
        <List>
          {activities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: activity.color, width: 32, height: 32 }}>
                    {activity.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

// Quick Actions Component
function QuickActions({ actions }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={6} key={index}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={action.icon}
                  onClick={action.onClick}
                  sx={{
                    py: 2,
                    flexDirection: 'column',
                    gap: 1,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="caption" textAlign="center">
                    {action.label}
                  </Typography>
                </Button>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const { user, hasRole } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userDashboard, analyticsData] = await Promise.all([
          userAPI.getUserDashboard(),
          analyticsAPI.getDashboardStats(),
        ]);
        
        setDashboardData({
          user: userDashboard.data,
          analytics: analyticsData.data,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set mock data for demonstration
        setDashboardData({
          user: {
            recentApplications: 5,
            upcomingInterviews: 2,
            profileCompletion: 85,
          },
          analytics: {
            totalJobs: 150,
            totalApplications: 1200,
            totalInterviews: 85,
            activeUsers: 500,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Sample data - this would come from your API
  const recentActivities = [
    {
      title: 'Application Submitted',
      description: 'Frontend Developer at Tech Corp',
      time: '2 hours ago',
      icon: <Assignment />,
      color: '#1976d2',
    },
    {
      title: 'Interview Scheduled',
      description: 'Backend Developer position',
      time: '1 day ago',
      icon: <Schedule />,
      color: '#2e7d32',
    },
    {
      title: 'Job Posted',
      description: 'Full Stack Developer role',
      time: '2 days ago',
      icon: <Work />,
      color: '#ed6c02',
    },
  ];

  const getQuickActions = () => {
    if (hasRole('STUDENT')) {
      return [
        {
          label: 'Browse Jobs',
          icon: <Work />,
          onClick: () => {},
        },
        {
          label: 'Update Profile',
          icon: <People />,
          onClick: () => {},
        },
        {
          label: 'View Applications',
          icon: <Assignment />,
          onClick: () => {},
        },
        {
          label: 'Schedule Interview',
          icon: <Schedule />,
          onClick: () => {},
        },
      ];
    } else if (hasRole('RECRUITER')) {
      return [
        {
          label: 'Post Job',
          icon: <Work />,
          onClick: () => {},
        },
        {
          label: 'Review Applications',
          icon: <Assignment />,
          onClick: () => {},
        },
        {
          label: 'Schedule Interviews',
          icon: <Schedule />,
          onClick: () => {},
        },
        {
          label: 'View Analytics',
          icon: <TrendingUp />,
          onClick: () => {},
        },
      ];
    }
    return [];
  };

  const getStatsCards = () => {
    if (hasRole('STUDENT')) {
      return [
        {
          title: 'Applications Sent',
          value: dashboardData?.user?.recentApplications || 5,
          icon: <Assignment />,
          color: '#1976d2',
          trend: '+12% this week',
        },
        {
          title: 'Interviews Scheduled',
          value: dashboardData?.user?.upcomingInterviews || 2,
          icon: <Schedule />,
          color: '#2e7d32',
          trend: '+2 new',
        },
        {
          title: 'Profile Completion',
          value: `${dashboardData?.user?.profileCompletion || 85}%`,
          icon: <People />,
          color: '#ed6c02',
        },
        {
          title: 'Job Matches',
          value: 12,
          icon: <Work />,
          color: '#9c27b0',
          trend: '+3 new',
        },
      ];
    } else if (hasRole('RECRUITER')) {
      return [
        {
          title: 'Active Jobs',
          value: 8,
          icon: <Work />,
          color: '#1976d2',
          trend: '+2 this week',
        },
        {
          title: 'Applications Received',
          value: 45,
          icon: <Assignment />,
          color: '#2e7d32',
          trend: '+15% this week',
        },
        {
          title: 'Interviews Today',
          value: 3,
          icon: <Schedule />,
          color: '#ed6c02',
        },
        {
          title: 'Candidates Hired',
          value: 12,
          icon: <CheckCircle />,
          color: '#9c27b0',
          trend: '+3 this month',
        },
      ];
    } else {
      return [
        {
          title: 'Total Jobs',
          value: dashboardData?.analytics?.totalJobs || 150,
          icon: <Work />,
          color: '#1976d2',
          trend: '+8% this month',
        },
        {
          title: 'Total Applications',
          value: dashboardData?.analytics?.totalApplications || 1200,
          icon: <Assignment />,
          color: '#2e7d32',
          trend: '+15% this month',
        },
        {
          title: 'Interviews Conducted',
          value: dashboardData?.analytics?.totalInterviews || 85,
          icon: <Schedule />,
          color: '#ed6c02',
          trend: '+12% this month',
        },
        {
          title: 'Active Users',
          value: dashboardData?.analytics?.activeUsers || 500,
          icon: <People />,
          color: '#9c27b0',
          trend: '+20% this month',
        },
      ];
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Loading Dashboard...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={4}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's what's happening with your {hasRole('STUDENT') ? 'job search' : hasRole('RECRUITER') ? 'recruitment' : 'platform'} today.
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {getStatsCards().map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <RecentActivity activities={recentActivities} />
          </motion.div>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <QuickActions actions={getQuickActions()} />
          </motion.div>
        </Grid>

        {/* Profile Completion (for students) */}
        {hasRole('STUDENT') && (
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Profile Completion
                  </Typography>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Complete your profile</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {dashboardData?.user?.profileCompletion || 85}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={dashboardData?.user?.profileCompletion || 85}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Complete your profile to get better job recommendations
                  </Typography>
                  <Button variant="outlined" size="small">
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )}

        {/* Upcoming Interviews */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Upcoming Interviews
                  </Typography>
                  <IconButton size="small">
                    <CalendarToday />
                  </IconButton>
                </Box>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#1976d2' }}>
                        <Business />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Frontend Developer"
                      secondary="Tech Corp • Tomorrow 2:00 PM"
                    />
                    <Chip label="Video Call" size="small" color="primary" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#2e7d32' }}>
                        <Business />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Backend Developer"
                      secondary="StartupXYZ • Friday 10:00 AM"
                    />
                    <Chip label="In Person" size="small" color="success" />
                  </ListItem>
                </List>
                <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                  View All Interviews
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;