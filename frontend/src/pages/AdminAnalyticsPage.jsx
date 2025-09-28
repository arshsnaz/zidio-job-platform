import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Filter,
  Download,
  MoreVertical,
  Shield,
  UserCheck,
  Building2,
  Eye,
  Clock
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
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { useAuth } from '../context/AuthContext'

const AdminAnalyticsPage = () => {
  const { user } = useAuth()
  const [timeframe, setTimeframe] = useState('30days')

  // Admin-specific data
  const platformStats = [
    {
      title: 'Total Users',
      value: '15,247',
      change: '+12.5%',
      changeType: 'increase',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Companies',
      value: '1,234',
      change: '+8.2%',
      changeType: 'increase',
      icon: Building2,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Jobs Posted',
      value: '8,945',
      change: '+15.3%',
      changeType: 'increase',
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Platform Revenue',
      value: '$124,500',
      change: '+22.1%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const userGrowthData = [
    { name: 'Jan', students: 1200, recruiters: 180, admins: 5 },
    { name: 'Feb', students: 1400, recruiters: 220, admins: 6 },
    { name: 'Mar', students: 1600, recruiters: 280, admins: 7 },
    { name: 'Apr', students: 1850, recruiters: 340, admins: 8 },
    { name: 'May', students: 2100, recruiters: 420, admins: 9 },
    { name: 'Jun', students: 2400, recruiters: 480, admins: 10 }
  ]

  const revenueData = [
    { name: 'Week 1', revenue: 12400, subscriptions: 45 },
    { name: 'Week 2', revenue: 15600, subscriptions: 52 },
    { name: 'Week 3', revenue: 18200, subscriptions: 61 },
    { name: 'Week 4', revenue: 21800, subscriptions: 73 }
  ]

  const userTypeDistribution = [
    { name: 'Students', value: 12500, color: '#3b82f6' },
    { name: 'Recruiters', value: 2500, color: '#10b981' },
    { name: 'Companies', value: 1200, color: '#f59e0b' },
    { name: 'Admins', value: 47, color: '#ef4444' }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'user_signup',
      user: 'Sarah Johnson',
      action: 'New student registered',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'job_posted',
      user: 'TechCorp Inc.',
      action: 'Posted Frontend Developer position',
      time: '15 minutes ago',
      status: 'info'
    },
    {
      id: 3,
      type: 'subscription',
      user: 'StartupXYZ',
      action: 'Upgraded to Premium plan',
      time: '1 hour ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'report',
      user: 'System Alert',
      action: 'High server load detected',
      time: '2 hours ago',
      status: 'warning'
    }
  ]

  const topCompanies = [
    { name: 'TechCorp', jobs: 45, applications: 1250, rating: 4.8 },
    { name: 'StartupXYZ', jobs: 32, applications: 890, rating: 4.6 },
    { name: 'InnovateLab', jobs: 28, applications: 750, rating: 4.7 },
    { name: 'DataFlow Inc', jobs: 24, applications: 620, rating: 4.5 },
    { name: 'CloudTech', jobs: 19, applications: 480, rating: 4.4 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Platform analytics and system monitoring</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platformStats.map((stat, index) => (
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
        {/* User Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Growth Trends</CardTitle>
            <CardDescription>Platform user acquisition over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
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
                  <Area type="monotone" dataKey="students" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="recruiters" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="admins" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Platform user types breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {userTypeDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>Weekly revenue and subscription trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
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
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="subscriptions" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Companies</CardTitle>
            <CardDescription>Companies with highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div key={company.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {company.jobs} jobs • {company.applications} applications
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{company.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Platform Activity</CardTitle>
              <CardDescription>Latest system events and user actions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${activity.status === 'success' ? 'bg-green-100 dark:bg-green-900' :
                      activity.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
                      activity.status === 'info' ? 'bg-blue-100 dark:bg-blue-900' :
                      'bg-gray-100 dark:bg-gray-800'
                    }
                  `}>
                    {activity.type === 'user_signup' && <UserCheck className="w-5 h-5 text-green-600" />}
                    {activity.type === 'job_posted' && <Briefcase className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'subscription' && <DollarSign className="w-5 h-5 text-green-600" />}
                    {activity.type === 'report' && <Shield className="w-5 h-5 text-yellow-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
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

export default AdminAnalyticsPage