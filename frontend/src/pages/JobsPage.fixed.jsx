import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Bookmark, 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal,
  Calendar,
  DollarSign,
  User
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import JobPostingWizard from '../components/JobPostingWizard';
import { toast } from 'react-hot-toast';
import { jobAPI } from '../services/api';

const JobsPage = () => {
  const { user } = useAuth();
  const [showJobWizard, setShowJobWizard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    totalViews: 0,
    avgApplyRate: 0
  });

  const isRecruiter = user?.role === 'RECRUITER' || user?.role === 'ADMIN';

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let response;
      
      if (isRecruiter && user?.email) {
        // Recruiters see their own jobs
        response = await jobAPI.getJobsByRecruiter(user.email);
      } else {
        // Students see all jobs
        response = await jobAPI.getAllJobs();
      }
      
      setJobs(response.data || []);
      
      // Calculate stats for recruiters
      if (isRecruiter && response.data) {
        const jobsData = response.data;
        setStats({
          activeJobs: jobsData.length,
          totalApplications: jobsData.reduce((sum, job) => sum + (job.applications || 0), 0),
          totalViews: jobsData.reduce((sum, job) => sum + (job.views || 0), 0),
          avgApplyRate: jobsData.length > 0 ? 
            (jobsData.reduce((sum, job) => sum + (job.applications || 0), 0) / jobsData.length).toFixed(1) : 0
        });
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleJobSubmit = async (jobData) => {
    try {
      await jobAPI.createJob({
        ...jobData,
        recruiterEmail: user.email
      });
      toast.success('Job posted successfully!');
      setShowJobWizard(false);
      fetchJobs(); // Refresh jobs list
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      (job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (job.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesFilter = filterType === 'all' || 
      (job.type?.toLowerCase() === filterType.toLowerCase());
    
    return matchesSearch && matchesFilter;
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
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
            {isRecruiter ? 'Job Management' : 'Job Opportunities'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {isRecruiter 
              ? 'Manage your job postings and track applications'
              : 'Discover your next career opportunity'
            }
          </p>
        </div>
        
        {isRecruiter && (
          <Button 
            onClick={() => setShowJobWizard(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search jobs, companies, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Stats for Recruiters */}
      {isRecruiter && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold">{stats.activeJobs}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">{stats.totalApplications}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Applications</p>
                  <p className="text-2xl font-bold">{stats.avgApplyRate}</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Bookmark className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid gap-6">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm || filterType !== 'all' ? 'No jobs found' : 'No jobs available'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : isRecruiter 
                    ? 'Post your first job to get started' 
                    : 'Check back later for new opportunities'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 dark:text-white mb-2">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          <span>{job.companyName || 'Company'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>
                        {job.type || 'Not specified'}
                      </Badge>
                      {job.stipend && (
                        <Badge variant="outline" className="text-green-600">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {job.stipend}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {job.description || 'No description available'}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {!isRecruiter && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          Apply Now
                        </Button>
                      )}
                      {isRecruiter && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Applications
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit Job
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {job.applications && (
                        <span>{job.applications} applications</span>
                      )}
                      {job.views && (
                        <span>{job.views} views</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Job Posting Wizard */}
      {showJobWizard && (
        <JobPostingWizard
          isOpen={showJobWizard}
          onClose={() => setShowJobWizard(false)}
          onSubmit={handleJobSubmit}
        />
      )}
    </motion.div>
  );
};

export default JobsPage;