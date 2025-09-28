import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Eye, 
  Calendar,
  Filter,
  Download,
  Plus,
  Search,
  MoreVertical,
  ChevronDown
} from 'lucide-react'
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
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Input } from '../components/ui/input'
import { useAuth } from '../context/AuthContext'
import { analyticsAPI, jobAPI, applicationAPI } from '../services/api'
import toast from 'react-hot-toast'

const AnalyticsPage = () => {
  const { user } = useAuth()
  const [timeframe, setTimeframe] = useState('7days')
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState({
    stats: [],
    applicationData: [],
    jobStatusData: [],
    recentApplications: []
  })

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeframe])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Get basic analytics stats
      const [jobsResponse, applicationsResponse] = await Promise.all([
        jobAPI.getJobsByRecruiter(user.email),
        applicationAPI.getAllApplications()
      ])

      const jobs = jobsResponse.data || []
      const applications = applicationsResponse.data || []
      
      // Calculate stats
      const stats = [
        {
          title: 'Total Applications',
          value: applications.length.toString(),
          change: '+12.5%',
          changeType: 'increase',
          icon: Users,
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Active Jobs',
          value: jobs.filter(job => job.status === 'ACTIVE').length.toString(),
          change: '+2',
          changeType: 'increase',
          icon: Briefcase,
          color: 'from-green-500 to-green-600'
        },
        {
          title: 'Job Views',
          value: jobs.reduce((total, job) => total + (job.views || 0), 0).toString(),
          change: '+15.3%',
          changeType: 'increase',
          icon: Eye,
          color: 'from-purple-500 to-purple-600'
        },
        {
          title: 'Total Jobs Posted',
          value: jobs.length.toString(),
          change: '+8.2%',
          changeType: 'increase',
          icon: Calendar,
          color: 'from-orange-500 to-orange-600'
        }
      ]

      // Generate application data for the last 7 days
      const applicationData = generateApplicationTrend(applications)
      
      // Generate job status data
      const jobStatusData = [
        { 
          name: 'Active', 
          value: jobs.filter(job => job.status === 'ACTIVE').length, 
          color: '#3b82f6' 
        },
        { 
          name: 'Draft', 
          value: jobs.filter(job => job.status === 'DRAFT').length, 
          color: '#6b7280' 
        },
        { 
          name: 'Closed', 
          value: jobs.filter(job => job.status === 'CLOSED').length, 
          color: '#10b981' 
        },
        { 
          name: 'Expired', 
          value: jobs.filter(job => job.status === 'EXPIRED').length, 
          color: '#ef4444' 
        }
      ]

      // Get recent applications
      const recentApplications = applications.slice(0, 10).map(app => ({
        id: app.id,
        candidate: app.studentName || 'N/A',
        position: app.jobTitle || 'Unknown Position',
        appliedDate: formatDate(app.appliedDate),
        status: app.status || 'APPLIED',
        statusColor: getStatusColor(app.status),
        avatar: null,
        email: app.studentEmail
      }))

      setAnalyticsData({
        stats,
        applicationData,
        jobStatusData,
        recentApplications
      })

    } catch (error) {
      console.error('Error fetching analytics data:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const generateApplicationTrend = (applications) => {
    // Create last 7 days data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const last7Days = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = days[date.getDay()]
      
      const dayApplications = applications.filter(app => {
        const appDate = new Date(app.appliedDate)
        return appDate.toDateString() === date.toDateString()
      })
      
      last7Days.push({
        name: dayName,
        applications: dayApplications.length,
        views: Math.floor(dayApplications.length * 4.5) // Estimated views
      })
    }
    
    return last7Days
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPLIED': return 'default'
      case 'SHORTLIST': return 'secondary'
      case 'INTERVIEW': return 'outline'
      case 'SELECTED': return 'default'
      case 'REJECTED': return 'destructive'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruitment Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Monitor your hiring performance and metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Application Trends</CardTitle>
                <CardDescription>Applications and job views over time</CardDescription>
              </div>
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.applicationData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="views" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Job Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Job Status</CardTitle>
            <CardDescription>Distribution of your job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.jobStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.jobStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {analyticsData.jobStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest candidates who applied to your positions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.recentApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={application.avatar} />
                    <AvatarFallback>
                      {application.candidate.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{application.candidate}</p>
                    <p className="text-sm text-muted-foreground">{application.position}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={
                      application.statusColor === 'success' ? 'default' :
                      application.statusColor === 'warning' ? 'secondary' :
                      application.statusColor === 'destructive' ? 'destructive' : 'outline'
                    }
                  >
                    {application.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{application.appliedDate}</span>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default AnalyticsPage