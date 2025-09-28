import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Work,
  People,
  Assignment,
  Schedule,
  Business,
  Visibility,
  AttachMoney,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';

// Colors for charts
const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#f44336'];

// Metric Card Component
function MetricCard({ title, value, change, icon, color, trend }) {
  const isPositive = change > 0;
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" gutterBottom variant="body2">
                {title}
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {value}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp 
                  sx={{ 
                    fontSize: 16, 
                    color: isPositive ? 'success.main' : 'error.main',
                    mr: 0.5,
                    transform: isPositive ? 'none' : 'rotate(180deg)'
                  }} 
                />
                <Typography 
                  variant="body2" 
                  color={isPositive ? 'success.main' : 'error.main'}
                >
                  {isPositive ? '+' : ''}{change}% vs last month
                </Typography>
              </Box>
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

// Chart Card Component
function ChartCard({ title, children, action }) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          {action}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

function AnalyticsPage() {
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState(null);

  // Sample analytics data
  const sampleData = {
    metrics: {
      totalJobs: { value: 150, change: 12 },
      totalApplications: { value: 1250, change: 18 },
      totalInterviews: { value: 85, change: -5 },
      hireRate: { value: '12%', change: 3 },
      avgTimeToHire: { value: '21 days', change: -8 },
      activeUsers: { value: 2500, change: 25 },
    },
    applicationTrends: [
      { name: 'Jan', applications: 120, jobs: 15 },
      { name: 'Feb', applications: 140, jobs: 18 },
      { name: 'Mar', applications: 180, jobs: 22 },
      { name: 'Apr', applications: 160, jobs: 20 },
      { name: 'May', applications: 200, jobs: 25 },
      { name: 'Jun', applications: 190, jobs: 23 },
      { name: 'Jul', applications: 220, jobs: 28 },
    ],
    jobsByCategory: [
      { name: 'Engineering', value: 45, color: '#1976d2' },
      { name: 'Design', value: 20, color: '#2e7d32' },
      { name: 'Product', value: 15, color: '#ed6c02' },
      { name: 'Marketing', value: 12, color: '#9c27b0' },
      { name: 'Sales', value: 8, color: '#f44336' },
    ],
    applicationsByStatus: [
      { name: 'Pending', value: 30 },
      { name: 'Under Review', value: 25 },
      { name: 'Interview', value: 20 },
      { name: 'Offered', value: 15 },
      { name: 'Rejected', value: 10 },
    ],
    topPerformingJobs: [
      {
        id: 1,
        title: 'Frontend Developer',
        company: 'Tech Corp',
        applications: 45,
        views: 230,
        hires: 3,
        status: 'Active',
      },
      {
        id: 2,
        title: 'Backend Developer',
        company: 'StartupXYZ',
        applications: 38,
        views: 180,
        hires: 2,
        status: 'Active',
      },
      {
        id: 3,
        title: 'Full Stack Developer',
        company: 'Innovation Labs',
        applications: 52,
        views: 290,
        hires: 4,
        status: 'Active',
      },
      {
        id: 4,
        title: 'UI/UX Designer',
        company: 'Design Studio',
        applications: 28,
        views: 120,
        hires: 1,
        status: 'Closed',
      },
      {
        id: 5,
        title: 'Data Scientist',
        company: 'Data Insights Co.',
        applications: 33,
        views: 160,
        hires: 2,
        status: 'Active',
      },
    ],
    interviewMetrics: [
      { name: 'Mon', scheduled: 8, completed: 7, cancelled: 1 },
      { name: 'Tue', scheduled: 12, completed: 10, cancelled: 2 },
      { name: 'Wed', scheduled: 10, completed: 9, cancelled: 1 },
      { name: 'Thu', scheduled: 15, completed: 13, cancelled: 2 },
      { name: 'Fri', scheduled: 9, completed: 8, cancelled: 1 },
      { name: 'Sat', scheduled: 3, completed: 3, cancelled: 0 },
      { name: 'Sun', scheduled: 2, completed: 2, cancelled: 0 },
    ],
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setAnalyticsData(sampleData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setAnalyticsData(sampleData);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <Typography>Loading analytics...</Typography>
      </Box>
    );
  }

  const { metrics, applicationTrends, jobsByCategory, applicationsByStatus, topPerformingJobs, interviewMetrics } = analyticsData;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {hasRole('ADMIN') 
              ? 'Platform-wide analytics and insights'
              : 'Your recruitment analytics and performance metrics'
            }
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 3 months</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Total Jobs"
            value={metrics.totalJobs.value}
            change={metrics.totalJobs.change}
            icon={<Work />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Applications"
            value={metrics.totalApplications.value}
            change={metrics.totalApplications.change}
            icon={<Assignment />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Interviews"
            value={metrics.totalInterviews.value}
            change={metrics.totalInterviews.change}
            icon={<Schedule />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Hire Rate"
            value={metrics.hireRate.value}
            change={metrics.hireRate.change}
            icon={<TrendingUp />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Avg. Time to Hire"
            value={metrics.avgTimeToHire.value}
            change={metrics.avgTimeToHire.change}
            icon={<Schedule />}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <MetricCard
            title="Active Users"
            value={metrics.activeUsers.value}
            change={metrics.activeUsers.change}
            icon={<People />}
            color="#4caf50"
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} mb={4}>
        {/* Application Trends */}
        <Grid item xs={12} md={8}>
          <ChartCard title="Application & Job Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#1976d2" 
                  strokeWidth={2}
                  name="Applications"
                />
                <Line 
                  type="monotone" 
                  dataKey="jobs" 
                  stroke="#2e7d32" 
                  strokeWidth={2}
                  name="Jobs Posted"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Jobs by Category */}
        <Grid item xs={12} md={4}>
          <ChartCard title="Jobs by Category">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} mb={4}>
        {/* Application Status */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Applications by Status">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationsByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Interview Metrics */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Weekly Interview Metrics">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={interviewMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="scheduled" 
                  stackId="1" 
                  stroke="#1976d2" 
                  fill="#1976d2"
                  name="Scheduled"
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stackId="1" 
                  stroke="#2e7d32" 
                  fill="#2e7d32"
                  name="Completed"
                />
                <Area 
                  type="monotone" 
                  dataKey="cancelled" 
                  stackId="1" 
                  stroke="#f44336" 
                  fill="#f44336"
                  name="Cancelled"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Top Performing Jobs Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Top Performing Jobs
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Job Title</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell align="center">Views</TableCell>
                      <TableCell align="center">Applications</TableCell>
                      <TableCell align="center">Hires</TableCell>
                      <TableCell align="center">Conversion Rate</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topPerformingJobs.map((job) => (
                      <TableRow key={job.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {job.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: '#1976d2' }}>
                              <Business sx={{ fontSize: 14 }} />
                            </Avatar>
                            {job.company}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                            <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                            {job.views}
                          </Box>
                        </TableCell>
                        <TableCell align="center">{job.applications}</TableCell>
                        <TableCell align="center">{job.hires}</TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            {((job.applications / job.views) * 100).toFixed(1)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={job.status}
                            size="small"
                            color={job.status === 'Active' ? 'success' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AnalyticsPage;