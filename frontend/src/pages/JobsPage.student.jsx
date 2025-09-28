import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  SlidersHorizontal,
  DollarSign,
  User,
  Bookmark,
  BookmarkCheck,
  X,
  ChevronDown,
  Star,
  Eye,
  Calendar,
  BriefcaseIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { jobAPI, applicationAPI, studentAPI } from '../services/api';

const StudentJobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  
  // Filter states
  const [filters, setFilters] = useState({
    jobType: [],
    location: [],
    salaryRange: '',
    experience: [],
    company: ''
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const salaryRanges = [
    { label: 'Under $50K', value: '0-50000' },
    { label: '$50K - $75K', value: '50000-75000' },
    { label: '$75K - $100K', value: '75000-100000' },
    { label: '$100K - $150K', value: '100000-150000' },
    { label: '$150K+', value: '150000+' }
  ];

  useEffect(() => {
    fetchJobs();
    fetchUserApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchTerm, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getAllJobs();
      const jobsData = response.data || [];
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserApplications = async () => {
    try {
      let studentId = user?.id;
      if (!studentId) {
        const studentResponse = await studentAPI.getByEmail(user.email);
        studentId = studentResponse.data?.id;
      }

      if (studentId) {
        const applicationsResponse = await applicationAPI.getApplicationsByStudent(studentId);
        const applications = applicationsResponse.data || [];
        const appliedJobIds = new Set(applications.map(app => app.jobId));
        setAppliedJobs(appliedJobIds);
      }
    } catch (error) {
      console.error('Error fetching user applications:', error);
    }
  };

  const applyFilters = () => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Job type filter
    if (filters.jobType.length > 0) {
      filtered = filtered.filter(job =>
        filters.jobType.some(type => job.type?.toLowerCase().includes(type.toLowerCase()))
      );
    }

    // Location filter
    if (filters.location.length > 0) {
      filtered = filtered.filter(job =>
        filters.location.some(location => 
          job.location?.toLowerCase().includes(location.toLowerCase())
        )
      );
    }

    // Company filter
    if (filters.company) {
      filtered = filtered.filter(job =>
        job.companyName?.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    // Salary range filter
    if (filters.salaryRange) {
      filtered = filtered.filter(job => {
        if (!job.stipend) return false;
        const stipend = job.stipend.toLowerCase();
        const [min, max] = filters.salaryRange.split('-');
        
        // Extract numeric value from stipend
        const numericValue = stipend.match(/\d+/g)?.join('') || '0';
        const salary = parseInt(numericValue);
        
        if (max === '+') {
          return salary >= parseInt(min);
        } else {
          return salary >= parseInt(min) && salary <= parseInt(max);
        }
      });
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(prev[filterType])
        ? prev[filterType].includes(value)
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value]
        : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      jobType: [],
      location: [],
      salaryRange: '',
      experience: [],
      company: ''
    });
    setSearchTerm('');
  };

  const handleApplyToJob = async (jobId) => {
    try {
      // Get student ID first
      let studentId = user?.id;
      if (!studentId) {
        const studentResponse = await studentAPI.getByEmail(user.email);
        studentId = studentResponse.data?.id;
      }

      if (!studentId) {
        toast.error('Student profile not found. Please complete your profile first.');
        return;
      }

      // Apply to job
      const applicationData = {
        studentId: studentId,
        jobId: jobId
      };

      await applicationAPI.applyToJob(applicationData);
      toast.success('Application submitted successfully!');
      
      // Update applied jobs set
      setAppliedJobs(prev => new Set([...prev, jobId]));
      
    } catch (error) {
      console.error('Error applying to job:', error);
      if (error.response?.status === 409) {
        toast.error('You have already applied to this job');
      } else {
        toast.error('Failed to submit application');
      }
    }
  };

  const toggleBookmark = (jobId) => {
    setBookmarkedJobs(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(jobId)) {
        newBookmarks.delete(jobId);
        toast.success('Job removed from bookmarks');
      } else {
        newBookmarks.add(jobId);
        toast.success('Job bookmarked!');
      }
      return newBookmarks;
    });
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

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) {
        return count + filter.length;
      }
      return count + (filter ? 1 : 0);
    }, 0) + (searchTerm ? 1 : 0);
  };

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
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-56 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
            Find Your Dream Job
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Discover opportunities that match your skills and interests
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {filteredJobs.length} jobs found
          </Badge>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="outline" className="px-3 py-1">
              {getActiveFiltersCount()} filters active
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search jobs, companies, skills, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-12 h-12 text-base"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>

          {/* Quick filter chips */}
          {jobTypes.slice(0, 4).map(type => (
            <Button
              key={type}
              variant={filters.jobType.includes(type) ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('jobType', type)}
            >
              {type}
            </Button>
          ))}

          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Job Type</label>
                  <div className="space-y-2">
                    {jobTypes.map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.jobType.includes(type)}
                          onChange={() => handleFilterChange('jobType', type)}
                          className="mr-2"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Salary Range Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Salary Range</label>
                  <select
                    value={filters.salaryRange}
                    onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="">Any Range</option>
                    {salaryRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Company Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <Input
                    placeholder="Search companies..."
                    value={filters.company}
                    onChange={(e) => handleFilterChange('company', e.target.value)}
                  />
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level</label>
                  <div className="space-y-2">
                    {experienceLevels.map(level => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.experience.includes(level)}
                          onChange={() => handleFilterChange('experience', level)}
                          className="mr-2"
                        />
                        <span className="text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BriefcaseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Try adjusting your search criteria or filters to find more opportunities
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl text-gray-900 dark:text-white">
                            {job.title}
                          </CardTitle>
                          {appliedJobs.has(job.id) && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Applied
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{job.companyName || 'Company'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location || 'Remote'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(job.createdAt)}</span>
                          </div>
                        </div>
                        <CardDescription className="text-gray-700 dark:text-gray-300 line-clamp-2">
                          {job.description || 'No description available'}
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(job.id)}
                          className="h-8 w-8 p-0"
                        >
                          {bookmarkedJobs.has(job.id) ? (
                            <BookmarkCheck className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>
                          {job.type || 'Not specified'}
                        </Badge>
                        {job.stipend && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {job.stipend}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!appliedJobs.has(job.id) ? (
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                            onClick={() => handleApplyToJob(job.id)}
                          >
                            Quick Apply
                          </Button>
                        ) : (
                          <Button variant="outline" disabled className="px-6">
                            Applied
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StudentJobsPage;