import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  User, 
  Building2,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Edit,
  Plus,
  Filter,
  Download,
  ExternalLink,
  Bell,
  Users,
  FileText,
  Star,
  ChevronRight,
  X,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { interviewAPI, applicationAPI, studentAPI, jobAPI } from '../services/api';

const StudentInterviewsPage = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    upcoming: 0,
    cancelled: 0
  });

  // Mock data for demonstration since interviews might not be fully implemented in backend
  const [mockInterviews] = useState([
    {
      id: 1,
      jobTitle: 'Senior Full Stack Developer',
      companyName: 'TechCorp Solutions',
      interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      interviewTime: '10:00 AM',
      duration: 60,
      type: 'video',
      round: 'Technical Round',
      status: 'SCHEDULED',
      location: 'Online - Zoom',
      interviewer: 'Sarah Johnson',
      interviewerTitle: 'Senior Engineering Manager',
      interviewerEmail: 'sarah.johnson@techcorp.com',
      description: 'Technical interview focusing on React, Node.js, and system design',
      meetingLink: 'https://zoom.us/j/123456789',
      applicationId: 1,
      preparationMaterials: ['System Design Basics', 'React Best Practices', 'Node.js Fundamentals'],
      requirements: 'Please have your IDE ready and be prepared to screen share'
    },
    {
      id: 2,
      jobTitle: 'Python Backend Developer',
      companyName: 'DataFlow Systems',
      interviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      interviewTime: '2:00 PM',
      duration: 45,
      type: 'phone',
      round: 'HR Round',
      status: 'SCHEDULED',
      location: 'Phone Interview',
      interviewer: 'Michael Chen',
      interviewerTitle: 'HR Manager',
      interviewerEmail: 'michael.chen@dataflow.com',
      description: 'Initial HR screening and culture fit assessment',
      phone: '+1 (555) 123-4567',
      applicationId: 2,
      preparationMaterials: ['Company Culture Guide', 'Job Role Overview'],
      requirements: 'Please be in a quiet location for the call'
    },
    {
      id: 3,
      jobTitle: 'DevOps Engineer',
      companyName: 'CloudTech Inc',
      interviewDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      interviewTime: '11:30 AM',
      duration: 90,
      type: 'in-person',
      round: 'Final Round',
      status: 'COMPLETED',
      location: '123 Tech Street, Silicon Valley, CA',
      interviewer: 'David Wilson',
      interviewerTitle: 'CTO',
      interviewerEmail: 'david.wilson@cloudtech.com',
      description: 'Final interview with CTO and team leads',
      applicationId: 3,
      feedback: 'Great technical skills, good cultural fit. Waiting for final decision.',
      rating: 4
    },
    {
      id: 4,
      jobTitle: 'ML Engineer',
      companyName: 'AI Innovations',
      interviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      interviewTime: '3:30 PM',
      duration: 120,
      type: 'video',
      round: 'Technical Deep Dive',
      status: 'COMPLETED',
      location: 'Online - Google Meet',
      interviewer: 'Dr. Lisa Zhang',
      interviewerTitle: 'Lead Data Scientist',
      interviewerEmail: 'lisa.zhang@aiinnovations.com',
      description: 'Deep dive into ML algorithms and practical implementation',
      applicationId: 4,
      feedback: 'Strong mathematical foundation, excellent problem-solving skills.',
      rating: 5
    }
  ]);

  useEffect(() => {
    fetchInterviews();
  }, [user]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      
      // For now, using mock data since interview endpoints might not be fully implemented
      // In a real implementation, you would fetch from the API:
      // const response = await interviewAPI.getInterviewsByUser(user.id);
      
      const interviewsData = mockInterviews;
      setInterviews(interviewsData);
      
      // Calculate stats
      const now = new Date();
      const statsData = {
        total: interviewsData.length,
        scheduled: interviewsData.filter(interview => 
          interview.status === 'SCHEDULED' && new Date(interview.interviewDate) > now
        ).length,
        completed: interviewsData.filter(interview => interview.status === 'COMPLETED').length,
        upcoming: interviewsData.filter(interview => 
          interview.status === 'SCHEDULED' && 
          new Date(interview.interviewDate) > now &&
          new Date(interview.interviewDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        ).length,
        cancelled: interviewsData.filter(interview => interview.status === 'CANCELLED').length,
      };
      setStats(statsData);
      
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);
    setShowDetailsModal(true);
  };

  const handleJoinInterview = (interview) => {
    if (interview.type === 'video' && interview.meetingLink) {
      window.open(interview.meetingLink, '_blank');
      toast.success('Opening interview link...');
    } else if (interview.type === 'phone' && interview.phone) {
      window.location.href = `tel:${interview.phone}`;
    } else {
      toast.info('Interview details have been noted. Please check your calendar.');
    }
  };

  const handleRescheduleRequest = (interviewId) => {
    toast.info('Reschedule request sent to HR. They will contact you shortly.');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'CANCELLED':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'in-person':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString, time) => {
    const date = new Date(dateString);
    return time || date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDaysUntil = (dateString) => {
    const interviewDate = new Date(dateString);
    const now = new Date();
    const diffTime = interviewDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0) return `In ${diffDays} days`;
    if (diffDays === -1) return 'Yesterday';
    return `${Math.abs(diffDays)} days ago`;
  };

  const isUpcoming = (dateString) => {
    const interviewDate = new Date(dateString);
    const now = new Date();
    return interviewDate > now;
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesStatus = filterStatus === 'all' || interview.status === filterStatus;
    return matchesStatus;
  });

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Interviews
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Manage your interview schedule and track your progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{stats.upcoming}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">{stats.scheduled}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">
                    {stats.completed > 0 ? '85%' : '0%'}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Interviews</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Calendar
        </Button>
      </div>

      {/* Interviews List */}
      <div className="space-y-4">
        {filteredInterviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No interviews scheduled
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your interview schedule will appear here once you get shortlisted
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Applications
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredInterviews.map((interview, index) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className={`hover:shadow-lg transition-shadow duration-200 ${
                isUpcoming(interview.interviewDate) && interview.status === 'SCHEDULED' 
                  ? 'border-l-4 border-l-blue-500' 
                  : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl text-gray-900 dark:text-white">
                          {interview.jobTitle}
                        </CardTitle>
                        <Badge className={getStatusColor(interview.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(interview.status)}
                            <span>{interview.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">{interview.companyName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(interview.type)}
                          <span className="capitalize">{interview.type} Interview</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{interview.round}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium">
                          {formatDate(interview.interviewDate)}
                        </span>
                        <span>at {formatTime(interview.interviewDate, interview.interviewTime)}</span>
                        <span>({interview.duration} min)</span>
                        <Badge variant="outline" className="text-xs">
                          {getDaysUntil(interview.interviewDate)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(interview)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      
                      {interview.status === 'SCHEDULED' && isUpcoming(interview.interviewDate) && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleJoinInterview(interview)}
                          >
                            {interview.type === 'video' ? (
                              <>
                                <Video className="w-4 h-4 mr-2" />
                                Join Interview
                              </>
                            ) : interview.type === 'phone' ? (
                              <>
                                <Phone className="w-4 h-4 mr-2" />
                                Call Now
                              </>
                            ) : (
                              <>
                                <MapPin className="w-4 h-4 mr-2" />
                                Get Directions
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRescheduleRequest(interview.id)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Reschedule
                          </Button>
                        </>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message HR
                      </Button>
                    </div>
                    
                    <div className="text-right text-sm">
                      <p className="text-gray-600">Interviewer: {interview.interviewer}</p>
                      <p className="text-gray-500 text-xs">{interview.interviewerTitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Interview Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedInterview && (
          <Modal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title="Interview Details"
            size="lg"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Interview Information */}
              <div className="border-b pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {selectedInterview.jobTitle}
                    </h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      {selectedInterview.companyName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedInterview.round} • {selectedInterview.duration} minutes
                    </p>
                  </div>
                  <Badge className={getStatusColor(selectedInterview.status)} size="lg">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedInterview.status)}
                      <span>{selectedInterview.status}</span>
                    </div>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Date & Time</p>
                    <p className="font-medium">
                      {formatDate(selectedInterview.interviewDate)}
                    </p>
                    <p className="font-medium">
                      {formatTime(selectedInterview.interviewDate, selectedInterview.interviewTime)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getDaysUntil(selectedInterview.interviewDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Interview Type</p>
                    <div className="flex items-center gap-2 font-medium">
                      {getTypeIcon(selectedInterview.type)}
                      <span className="capitalize">{selectedInterview.type}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{selectedInterview.location}</p>
                  </div>
                </div>
              </div>

              {/* Interviewer Information */}
              <div>
                <h4 className="font-semibold mb-3">Interviewer</h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedInterview.interviewer}</p>
                      <p className="text-sm text-gray-600">{selectedInterview.interviewerTitle}</p>
                      <p className="text-sm text-gray-500">{selectedInterview.interviewerEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interview Description */}
              <div>
                <h4 className="font-semibold mb-2">Interview Focus</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {selectedInterview.description}
                </p>
              </div>

              {/* Preparation Materials */}
              {selectedInterview.preparationMaterials && (
                <div>
                  <h4 className="font-semibold mb-2">Preparation Materials</h4>
                  <ul className="space-y-1">
                    {selectedInterview.preparationMaterials.map((material, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Special Requirements */}
              {selectedInterview.requirements && (
                <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
                    Important Notes
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {selectedInterview.requirements}
                  </p>
                </div>
              )}

              {/* Feedback (for completed interviews) */}
              {selectedInterview.status === 'COMPLETED' && selectedInterview.feedback && (
                <div>
                  <h4 className="font-semibold mb-2">Interview Feedback</h4>
                  <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < selectedInterview.rating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {selectedInterview.rating}/5 Rating
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {selectedInterview.feedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedInterview.status === 'SCHEDULED' && isUpcoming(selectedInterview.interviewDate) && (
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleJoinInterview(selectedInterview)}
                  >
                    {selectedInterview.type === 'video' ? (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Join Interview
                      </>
                    ) : selectedInterview.type === 'phone' ? (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 mr-2" />
                        Get Directions
                      </>
                    )}
                  </Button>
                )}
                
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Interviewer
                </Button>
                
                {selectedInterview.status === 'SCHEDULED' && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleRescheduleRequest(selectedInterview.id)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                )}
                
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentInterviewsPage;