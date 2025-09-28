import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/layout/Navigation';
import api from '../services/api';

// Icon Components
const Icons = {
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8m-8 0a2 2 0 00-2 2v6l10 4-10-4z" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  DollarSign: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  HeartFilled: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
};

const JobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    salaryRange: '',
    experience: ''
  });
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, filters, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/jobPosts');
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Mock data for demo if API fails
      const mockJobs = [
        {
          id: 1,
          title: "Senior Full Stack Developer",
          company: "TechCorp Inc.",
          location: "San Francisco, CA",
          type: "FULL_TIME",
          salary: "$120,000 - $150,000",
          experience: "5+ years",
          description: "We are looking for a senior full stack developer to join our growing team...",
          requirements: ["React", "Node.js", "Python", "AWS"],
          posted: "2 days ago",
          remote: true
        },
        {
          id: 2,
          title: "Product Manager",
          company: "InnovateLab",
          location: "New York, NY",
          type: "FULL_TIME",
          salary: "$100,000 - $130,000",
          experience: "3+ years",
          description: "Join our product team to drive innovation and growth...",
          requirements: ["Product Management", "Agile", "Analytics", "Leadership"],
          posted: "1 day ago",
          remote: false
        },
        {
          id: 3,
          title: "UI/UX Designer",
          company: "DesignStudio",
          location: "Los Angeles, CA",
          type: "FULL_TIME",
          salary: "$80,000 - $110,000",
          experience: "2+ years",
          description: "Create beautiful and intuitive user experiences...",
          requirements: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
          posted: "3 days ago",
          remote: true
        },
        {
          id: 4,
          title: "Data Scientist",
          company: "DataTech Solutions",
          location: "Seattle, WA",
          type: "FULL_TIME",
          salary: "$110,000 - $140,000",
          experience: "4+ years",
          description: "Analyze complex datasets to drive business decisions...",
          requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
          posted: "1 week ago",
          remote: true
        },
        {
          id: 5,
          title: "Marketing Specialist",
          company: "GrowthCorp",
          location: "Austin, TX",
          type: "PART_TIME",
          salary: "$50,000 - $70,000",
          experience: "1+ years",
          description: "Drive marketing campaigns and brand awareness...",
          requirements: ["Digital Marketing", "SEO", "Content Creation", "Analytics"],
          posted: "4 days ago",
          remote: false
        },
        {
          id: 6,
          title: "DevOps Engineer",
          company: "CloudTech",
          location: "Remote",
          type: "FULL_TIME",
          salary: "$95,000 - $125,000",
          experience: "3+ years",
          description: "Build and maintain our cloud infrastructure...",
          requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"],
          posted: "2 days ago",
          remote: true
        }
      ];
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !filters.location || 
                             job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesType = !filters.type || job.type === filters.type;
      
      return matchesSearch && matchesLocation && matchesType;
    });
    
    setFilteredJobs(filtered);
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleApply = async (jobId) => {
    try {
      if (!user) {
        alert('Please log in to apply for jobs');
        return;
      }
      
      const applicationData = {
        jobId: jobId,
        studentId: user.id,
        applicationDate: new Date().toISOString()
      };
      
      await api.post('/api/applications/apply', applicationData);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  const JobCard = ({ job }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
          <p className="text-lg font-medium text-blue-600 mb-1">{job.company}</p>
          <div className="flex items-center text-gray-600 mb-2">
            <Icons.MapPin />
            <span className="ml-1">{job.location}</span>
            {job.remote && (
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Remote
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={() => toggleSaveJob(job.id)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          {savedJobs.has(job.id) ? (
            <Icons.HeartFilled />
          ) : (
            <Icons.Heart />
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
          {job.type?.replace('_', ' ') || 'Full Time'}
        </span>
        {job.experience && (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {job.experience}
          </span>
        )}
        {job.salary && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            {job.salary}
          </span>
        )}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {job.description || 'Job description not available.'}
      </p>

      {job.requirements && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {job.requirements.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
              >
                {skill}
              </span>
            ))}
            {job.requirements.length > 4 && (
              <span className="text-gray-500 text-xs">
                +{job.requirements.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm flex items-center">
          <Icons.Clock />
          <span className="ml-1">{job.posted || 'Recently posted'}</span>
        </span>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleApply(job.id)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300"
          >
            Apply Now
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full font-medium hover:border-blue-600 hover:text-blue-600 transition-colors">
            <Icons.ExternalLink />
          </button>
        </div>
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
      <Navigation />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover opportunities that match your skills and aspirations
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Icons.Search />
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Icons.Search />
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors lg:w-auto"
            >
              <Icons.Filter />
              <span className="ml-2">Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">All Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">All Levels</option>
                  <option value="0-1 years">Entry Level (0-1 years)</option>
                  <option value="2-3 years">Mid Level (2-3 years)</option>
                  <option value="4-6 years">Senior Level (4-6 years)</option>
                  <option value="7+ years">Executive Level (7+ years)</option>
                </select>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
          
          {savedJobs.size > 0 && (
            <div className="flex items-center text-gray-600">
              <Icons.Heart />
              <span className="ml-1">{savedJobs.size} saved</span>
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6"
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard job={job} />
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ location: '', type: '', salaryRange: '', experience: '' });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Load More Button */}
        {filteredJobs.length > 0 && filteredJobs.length >= 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <button className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
              Load More Jobs
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;