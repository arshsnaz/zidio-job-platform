import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
  Download,
  Calendar,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  MessageSquare,
  Star,
  DollarSign,
  Briefcase,
  X,
  ChevronRight,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { applicationAPI, studentAPI, jobAPI } from '../services/api';

const StudentApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    shortlisted: 0,
    rejected: 0,
    selected: 0
  });

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let studentId = user?.id;
      
      if (!studentId) {
        const studentResponse = await studentAPI.getByEmail(user.email);
        studentId = studentResponse.data?.id;
      }

      if (studentId) {
        const response = await applicationAPI.getApplicationsByStudent(studentId);
        const applicationsData = response?.data || [];
        
        // Enrich applications with job details
        const enrichedApplications = await Promise.all(
          applicationsData.map(async (app) => {
            try {
              const jobResponse = await jobAPI.getJobById(app.jobId);
              return { ...app, jobDetails: jobResponse.data };
            } catch (error) {
              return app;
            }
          })
        );
        
        setApplications(enrichedApplications);
        
        // Calculate stats
        const statsData = {
          total: enrichedApplications.length,
          applied: enrichedApplications.filter(app => app.status === 'APPLIED').length,
          shortlisted: enrichedApplications.filter(app => app.status === 'SHORTLIST').length,
          rejected: enrichedApplications.filter(app => app.status === 'REJECTED').length,
          selected: enrichedApplications.filter(app => app.status === 'SELECTED').length,
        };
        setStats(statsData);
      }
      
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleWithdrawApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await applicationAPI.withdrawApplication(applicationId);
      toast.success('Application withdrawn successfully');
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast.error('Failed to withdraw application');
    }
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
        return <XCircle className="w-4 h-4 text-red-500" />;
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

  const getStatusDescription = (status) => {
    switch (status) {
      case 'APPLIED':
        return 'Your application has been submitted and is under review';
      case 'SHORTLIST':
        return 'Congratulations! You\'ve been shortlisted for this position';
      case 'SELECTED':
        return 'Amazing! You\'ve been selected for this position';
      case 'REJECTED':
        return 'Unfortunately, your application was not successful this time';
      default:
        return 'Status unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysAgo = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = 
      (app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (app.jobDetails?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (app.jobDetails?.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesStatus && matchesSearch;
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Applications
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Track your job application progress and manage your opportunities
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
                  <FileText className="w-4 h-4 text-gray-600" />
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
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.applied}</p>
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
                  <p className="text-sm text-muted-foreground">Shortlisted</p>
                  <p className="text-2xl font-bold">{stats.shortlisted}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-600" />
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
                  <p className="text-sm text-muted-foreground">Selected</p>
                  <p className="text-2xl font-bold">{stats.selected}</p>
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
                    {stats.total > 0 ? Math.round(((stats.selected + stats.shortlisted) / stats.total) * 100) : 0}%
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLIST">Shortlisted</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No applications found' : 'No applications yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Start applying to jobs to see them here'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse Jobs
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl text-gray-900 dark:text-white">
                          {application.jobTitle || 'Job Title N/A'}
                        </CardTitle>
                        <Badge className={getStatusColor(application.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            <span>{application.status || 'Unknown'}</span>
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">
                            {application.jobDetails?.companyName || 'Company N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{application.jobDetails?.location || 'Location N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Applied {getDaysAgo(application.appliedDate)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getStatusDescription(application.status)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {application.jobDetails?.stipend && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {application.jobDetails.stipend}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {application.jobDetails?.type || 'Full-time'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(application)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Messages
                      </Button>
                      {application.status === 'APPLIED' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleWithdrawApplication(application.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-right text-sm text-gray-500">
                      <p>Applied on {formatDate(application.appliedDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Application Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedApplication && (
          <Modal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title="Application Details"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Job Information */}
              <div className="border-b pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedApplication.jobTitle}
                    </h3>
                    <div className="flex items-center gap-4 text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{selectedApplication.jobDetails?.companyName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedApplication.jobDetails?.location}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedApplication.status)} size="lg">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedApplication.status)}
                      <span>{selectedApplication.status}</span>
                    </div>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Job Type:</p>
                    <p className="font-medium">{selectedApplication.jobDetails?.type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Salary:</p>
                    <p className="font-medium">{selectedApplication.jobDetails?.stipend || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Application Date:</p>
                    <p className="font-medium">{formatDate(selectedApplication.appliedDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Application ID:</p>
                    <p className="font-medium">#{selectedApplication.id}</p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              {selectedApplication.jobDetails?.description && (
                <div>
                  <h4 className="font-semibold mb-2">Job Description</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {selectedApplication.jobDetails.description}
                  </p>
                </div>
              )}

              {/* Application Timeline */}
              <div>
                <h4 className="font-semibold mb-3">Application Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">Application Submitted</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(selectedApplication.appliedDate)}
                      </p>
                    </div>
                  </div>
                  
                  {selectedApplication.status !== 'APPLIED' && (
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedApplication.status === 'SHORTLIST' ? 'bg-yellow-600' :
                        selectedApplication.status === 'SELECTED' ? 'bg-green-600' :
                        selectedApplication.status === 'REJECTED' ? 'bg-red-600' : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <p className="font-medium text-sm">
                          Status Updated to {selectedApplication.status}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getDaysAgo(selectedApplication.appliedDate)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 opacity-50">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">Interview Scheduled</p>
                      <p className="text-xs text-gray-500">Pending</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedApplication.jobDetails && (
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Job Posting
                  </Button>
                )}
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                {selectedApplication.status === 'APPLIED' && (
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleWithdrawApplication(selectedApplication.id);
                      setShowDetailsModal(false);
                    }}
                  >
                    Withdraw Application
                  </Button>
                )}
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentApplicationsPage;