import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Icon Components
const Icons = {
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  XCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8m-8 0a2 2 0 00-2 2v6l10 4-10-4z" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
};

const ApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedApp, setExpandedApp] = useState(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchApplications();
  }, [user]);

  useEffect(() => {
    filterApplications();
    calculateStatistics();
  }, [applications, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;
      
      const response = await api.get(`/api/applications/student/${user.id}`);
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Mock data for demo
      const mockApplications = [
        {
          id: 1,
          jobTitle: "Senior Full Stack Developer",
          company: "TechCorp Inc.",
          location: "San Francisco, CA",
          appliedDate: "2024-01-15T10:00:00Z",
          status: "PENDING",
          salary: "$120,000 - $150,000",
          jobType: "FULL_TIME",
          remote: true,
          description: "We are looking for a senior full stack developer to join our growing team.",
          requirements: ["React", "Node.js", "Python", "AWS"],
          lastUpdate: "2024-01-15T10:00:00Z",
          notes: "Application submitted successfully. Waiting for initial review."
        },
        {
          id: 2,
          jobTitle: "Product Manager",
          company: "InnovateLab",
          location: "New York, NY",
          appliedDate: "2024-01-12T14:30:00Z",
          status: "REVIEWED",
          salary: "$100,000 - $130,000",
          jobType: "FULL_TIME",
          remote: false,
          description: "Join our product team to drive innovation and growth.",
          requirements: ["Product Management", "Agile", "Analytics", "Leadership"],
          lastUpdate: "2024-01-14T09:15:00Z",
          notes: "Application has been reviewed by HR. Next step: technical interview."
        },
        {
          id: 3,
          jobTitle: "UI/UX Designer",
          company: "DesignStudio",
          location: "Los Angeles, CA",
          appliedDate: "2024-01-10T11:20:00Z",
          status: "ACCEPTED",
          salary: "$80,000 - $110,000",
          jobType: "FULL_TIME",
          remote: true,
          description: "Create beautiful and intuitive user experiences.",
          requirements: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
          lastUpdate: "2024-01-16T16:45:00Z",
          notes: "Congratulations! Your application has been accepted. HR will contact you for next steps."
        },
        {
          id: 4,
          jobTitle: "Data Scientist",
          company: "DataTech Solutions",
          location: "Seattle, WA",
          appliedDate: "2024-01-08T09:45:00Z",
          status: "REJECTED",
          salary: "$110,000 - $140,000",
          jobType: "FULL_TIME",
          remote: true,
          description: "Analyze complex datasets to drive business decisions.",
          requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
          lastUpdate: "2024-01-13T13:20:00Z",
          notes: "Thank you for your interest. We have decided to move forward with other candidates."
        },
        {
          id: 5,
          jobTitle: "Marketing Specialist",
          company: "GrowthCorp",
          location: "Austin, TX",
          appliedDate: "2024-01-05T16:10:00Z",
          status: "PENDING",
          salary: "$50,000 - $70,000",
          jobType: "PART_TIME",
          remote: false,
          description: "Drive marketing campaigns and brand awareness.",
          requirements: ["Digital Marketing", "SEO", "Content Creation", "Analytics"],
          lastUpdate: "2024-01-05T16:10:00Z",
          notes: "Application submitted. Awaiting initial screening."
        }
      ];
      setApplications(mockApplications);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;
    
    if (statusFilter) {
      filtered = applications.filter(app => app.status === statusFilter);
    }
    
    // Sort by applied date (most recent first)
    filtered.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    
    setFilteredApplications(filtered);
  };

  const calculateStatistics = () => {
    const stats = applications.reduce((acc, app) => {
      acc.total++;
      acc[app.status.toLowerCase()]++;
      return acc;
    }, {
      total: 0,
      pending: 0,
      reviewed: 0,
      accepted: 0,
      rejected: 0
    });
    
    setStatistics(stats);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Icons.Clock />;
      case 'REVIEWED':
        return <Icons.Eye />;
      case 'ACCEPTED':
        return <Icons.CheckCircle />;
      case 'REJECTED':
        return <Icons.XCircle />;
      default:
        return <Icons.Clock />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const ApplicationCard = ({ application }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {application.jobTitle}
            </h3>
            <p className="text-lg font-medium text-blue-600 mb-2">
              {application.company}
            </p>
            <div className="flex items-center text-gray-600 mb-3">
              <Icons.MapPin />
              <span className="ml-1">{application.location}</span>
              {application.remote && (
                <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Remote
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
              {getStatusIcon(application.status)}
              <span className="ml-1">{application.status}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            {application.jobType?.replace('_', ' ') || 'Full Time'}
          </span>
          {application.salary && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              {application.salary}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Icons.Calendar />
            <span className="ml-1">Applied: {formatDate(application.appliedDate)}</span>
          </div>
          <div className="flex items-center">
            <Icons.Clock />
            <span className="ml-1">Updated: {formatDate(application.lastUpdate)}</span>
          </div>
        </div>

        {application.notes && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-700">{application.notes}</p>
          </div>
        )}

        <button
          onClick={() => setExpandedApp(expandedApp === application.id ? null : application.id)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="mr-1">
            {expandedApp === application.id ? 'Hide Details' : 'View Details'}
          </span>
          <motion.div
            animate={{ rotate: expandedApp === application.id ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icons.ChevronDown />
          </motion.div>
        </button>

        <AnimatePresence>
          {expandedApp === application.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Job Description</h4>
                  <p className="text-gray-700 text-sm">{application.description}</p>
                </div>
                
                {application.requirements && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.requirements.map((req, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:shadow-lg transition-all duration-300">
                    View Job Details
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:border-blue-600 hover:text-blue-600 transition-colors">
                    Withdraw Application
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Applications
              </h1>
              <p className="text-xl text-gray-600">
                Track your job applications and their progress
              </p>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{statistics.total}</div>
                <div className="text-gray-600 text-sm">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{statistics.pending}</div>
                <div className="text-gray-600 text-sm">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statistics.accepted}</div>
                <div className="text-gray-600 text-sm">Accepted</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards - Mobile */}
        <div className="grid grid-cols-2 md:hidden gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{statistics.total}</div>
            <div className="text-gray-600 text-sm">Total Applications</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{statistics.pending}</div>
            <div className="text-gray-600 text-sm">Pending</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{statistics.accepted}</div>
            <div className="text-gray-600 text-sm">Accepted</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-red-600">{statistics.rejected}</div>
            <div className="text-gray-600 text-sm">Rejected</div>
          </div>
        </div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icons.Filter />
              <span className="font-medium text-gray-700">Filter by status:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === '' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({statistics.total})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'PENDING' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({statistics.pending})
              </button>
              <button
                onClick={() => setStatusFilter('REVIEWED')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'REVIEWED' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Reviewed ({statistics.reviewed})
              </button>
              <button
                onClick={() => setStatusFilter('ACCEPTED')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'ACCEPTED' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Accepted ({statistics.accepted})
              </button>
              <button
                onClick={() => setStatusFilter('REJECTED')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'REJECTED' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected ({statistics.rejected})
              </button>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ApplicationCard application={application} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-2xl p-12 shadow-lg">
                <Icons.Briefcase />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {statusFilter ? `No ${statusFilter.toLowerCase()} applications` : 'No applications yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {statusFilter 
                    ? `You don't have any ${statusFilter.toLowerCase()} applications at the moment.`
                    : "You haven't applied to any jobs yet. Start exploring opportunities!"
                  }
                </p>
                <button
                  onClick={() => window.location.href = '/jobs'}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
                >
                  Browse Jobs
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationsPage;