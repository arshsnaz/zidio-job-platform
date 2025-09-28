import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellRing,
  Search,
  Zap,
  Check,
  X,
  Clock,
  Briefcase,
  Calendar,
  MessageSquare,
  Star,
  AlertCircle,
  ChevronDown,
  Filter,
  ExternalLink,
  BookmarkPlus,
  Eye,
  Building2,
  MapPin,
  DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Modal } from '../components/ui/modal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { jobAPI, applicationAPI, studentAPI, userAPI } from '../services/api';

const QuickApplyWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickJobs, setQuickJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(new Set());

  useEffect(() => {
    if (isOpen) {
      fetchQuickJobs();
    }
  }, [isOpen]);

  const fetchQuickJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getAllJobs();
      const jobs = response.data || [];
      
      // Get user's applied jobs to filter them out
      let appliedJobIds = [];
      try {
        let studentId = user?.id;
        if (!studentId) {
          const studentResponse = await studentAPI.getByEmail(user.email);
          studentId = studentResponse.data?.id;
        }
        
        if (studentId) {
          const applicationsResponse = await applicationAPI.getApplicationsByStudent(studentId);
          appliedJobIds = (applicationsResponse.data || []).map(app => app.jobId);
        }
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
      }

      // Filter out applied jobs and show recent ones first
      const availableJobs = jobs
        .filter(job => !appliedJobIds.includes(job.id))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10); // Show top 10 most recent

      setQuickJobs(availableJobs);
    } catch (error) {
      console.error('Error fetching quick jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickApply = async (jobId) => {
    try {
      setApplying(prev => new Set([...prev, jobId]));
      
      // Get student ID
      let studentId = user?.id;
      if (!studentId) {
        const studentResponse = await studentAPI.getByEmail(user.email);
        studentId = studentResponse.data?.id;
      }

      if (!studentId) {
        toast.error('Please complete your profile to apply to jobs');
        return;
      }

      const applicationData = {
        studentId: studentId,
        jobId: jobId
      };

      await applicationAPI.applyToJob(applicationData);
      toast.success('Quick application submitted successfully! 🚀');
      
      // Remove the job from the quick apply list
      setQuickJobs(prev => prev.filter(job => job.id !== jobId));
      
    } catch (error) {
      console.error('Error in quick apply:', error);
      if (error.response?.status === 409) {
        toast.error('You have already applied to this job');
      } else {
        toast.error('Failed to submit quick application');
      }
    } finally {
      setApplying(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const filteredJobs = quickJobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.ceil(diffDays / 7)}w ago`;
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
        size="sm"
      >
        <Zap className="w-4 h-4 mr-2" />
        Quick Apply
      </Button>

      <AnimatePresence>
        {isOpen && (
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Quick Apply to Jobs"
            size="lg"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs for quick apply..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Jobs List */}
              <div className="max-h-96 overflow-y-auto space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {searchTerm ? 'No jobs match your search' : 'No new jobs available for quick apply'}
                    </p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {job.title}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              <span>{job.companyName || 'Company'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{job.location || 'Remote'}</span>
                            </div>
                            <span>{formatDate(job.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {job.type || 'Full-time'}
                            </Badge>
                            {job.stipend && (
                              <Badge variant="outline" className="text-green-600 text-xs">
                                <DollarSign className="w-2 h-2 mr-1" />
                                {job.stipend}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleQuickApply(job.id)}
                            disabled={applying.has(job.id)}
                          >
                            {applying.has(job.id) ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-3 h-3 border-2 border-white border-t-transparent rounded-full mr-1"
                                />
                                Applying...
                              </>
                            ) : (
                              <>
                                <Zap className="w-3 h-3 mr-1" />
                                Apply
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-gray-600">
                  {filteredJobs.length} jobs available for quick apply
                </p>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Browse All Jobs
                </Button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

const NotificationWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Mock notifications - in real app, fetch from API
  const [mockNotifications] = useState([
    {
      id: 1,
      type: 'application_status',
      title: 'Application Update',
      message: 'Your application for Senior Developer at TechCorp has been shortlisted!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: false,
      actionUrl: '/applications',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    {
      id: 2,
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: 'You have an interview scheduled for tomorrow at 10:00 AM with DataFlow Systems.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      read: false,
      actionUrl: '/interviews',
      icon: Calendar,
      iconColor: 'text-blue-500'
    },
    {
      id: 3,
      type: 'new_job_match',
      title: 'New Job Match',
      message: '3 new jobs match your profile. Check them out!',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      read: false,
      actionUrl: '/jobs',
      icon: Briefcase,
      iconColor: 'text-purple-500'
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message',
      message: 'HR from CloudTech Inc. sent you a message regarding your application.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      read: true,
      actionUrl: '/messages',
      icon: MessageSquare,
      iconColor: 'text-indigo-500'
    },
    {
      id: 5,
      type: 'profile_view',
      title: 'Profile Viewed',
      message: 'Your profile was viewed by 2 recruiters today.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      read: true,
      actionUrl: '/profile',
      icon: Eye,
      iconColor: 'text-orange-500'
    }
  ]);

  useEffect(() => {
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      // In real app: await userAPI.markNotificationRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // In real app: await userAPI.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    setIsOpen(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[1.2rem] h-5 flex items-center justify-center rounded-full p-0"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="text-xs"
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => {
                      const IconComponent = notification.icon;
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-950' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 ${notification.iconColor}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-sm text-gray-900 dark:text-white">
                                  {notification.title}
                                </p>
                                <div className="flex items-center gap-2 ml-2">
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                  <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {formatTimestamp(notification.timestamp)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                            >
                              Mark as read
                            </Button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-sm"
                    onClick={() => {
                      setIsOpen(false);
                      window.location.href = '/notifications';
                    }}
                  >
                    View all notifications
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Combined component for the navigation bar
const StudentNavigation = () => {
  const { user } = useAuth();

  if (user?.role !== 'STUDENT') {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <QuickApplyWidget />
      <NotificationWidget />
    </div>
  );
};

export { QuickApplyWidget, NotificationWidget, StudentNavigation };
export default StudentNavigation;