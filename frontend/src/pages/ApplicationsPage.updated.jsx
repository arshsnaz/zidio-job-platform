import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Mail
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { applicationAPI, studentAPI } from '../services/api';

const ApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    shortlisted: 0,
    rejected: 0,
    selected: 0
  });

  const isRecruiter = user?.role === 'RECRUITER' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let response;
      
      if (isRecruiter) {
        // For recruiters, we need to get applications for their job posts
        // This would require a different API endpoint
        // For now, let's fetch all applications (will need backend update)
        response = await applicationAPI.getAllApplications();
      } else {
        // For students, get their applications by student ID
        if (user?.id) {
          response = await applicationAPI.getApplicationsByStudent(user.id);
        } else {
          // If we don't have student ID, try to get it from email
          const studentResponse = await studentAPI.getByEmail(user.email);
          if (studentResponse.data?.id) {
            response = await applicationAPI.getApplicationsByStudent(studentResponse.data.id);
          }
        }
      }
      
      const applicationsData = response?.data || [];
      setApplications(applicationsData);
      
      // Calculate stats
      const statsData = {
        total: applicationsData.length,
        applied: applicationsData.filter(app => app.status === 'APPLIED').length,
        shortlisted: applicationsData.filter(app => app.status === 'SHORTLIST').length,
        rejected: applicationsData.filter(app => app.status === 'REJECTED').length,
        selected: applicationsData.filter(app => app.status === 'SELECTED').length,
      };
      setStats(statsData);
      
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await applicationAPI.updateApplicationStatus(applicationId, newStatus);
      toast.success('Application status updated');
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = 
      (app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
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
          {isRecruiter ? 'Job Applications' : 'My Applications'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {isRecruiter 
            ? 'Manage and track job applications'
            : 'Track your job application progress'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applied</p>
                <p className="text-2xl font-bold">{stats.applied}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Shortlisted</p>
                <p className="text-2xl font-bold">{stats.shortlisted}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
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
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={isRecruiter ? "Search by job title or candidate..." : "Search by job title..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground"
          >
            <option value="all">All Status</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLIST">Shortlisted</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No applications found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : isRecruiter
                    ? 'No applications received yet'
                    : 'You haven\'t applied to any jobs yet'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 dark:text-white mb-2">
                        {application.jobTitle || 'Job Title N/A'}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        {isRecruiter && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{application.studentName || 'Student Name N/A'}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Applied: {formatDate(application.appliedDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(application.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          <span>{application.status || 'Unknown'}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {!isRecruiter ? (
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                          <div className="flex gap-1">
                            {application.status !== 'SHORTLIST' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStatusUpdate(application.id, 'SHORTLIST')}
                                className="text-yellow-600 hover:bg-yellow-50"
                              >
                                Shortlist
                              </Button>
                            )}
                            {application.status !== 'SELECTED' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStatusUpdate(application.id, 'SELECTED')}
                                className="text-green-600 hover:bg-green-50"
                              >
                                Select
                              </Button>
                            )}
                            {application.status !== 'REJECTED' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStatusUpdate(application.id, 'REJECTED')}
                                className="text-red-600 hover:bg-red-50"
                              >
                                Reject
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ApplicationsPage;