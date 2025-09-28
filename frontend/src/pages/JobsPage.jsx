import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Work,
  Business,
  AttachMoney,
  Schedule,
  Favorite,
  FavoriteBorder,
  Share,
  Add,
  FilterList,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { jobAPI } from '../services/api';

// Job Card Component
function JobCard({ job, onApply, onSave, isSaved }) {
  const { hasRole } = useAuth();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card sx={{ height: '100%', position: 'relative' }}>
        <CardContent>
          {/* Company Info */}
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              sx={{
                bgcolor: '#1976d2',
                width: 50,
                height: 50,
                mr: 2,
              }}
            >
              <Business />
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {job.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {job.company}
              </Typography>
            </Box>
            <IconButton onClick={() => onSave(job.id)}>
              {isSaved ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Box>

          {/* Job Details */}
          <Box mb={2}>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {job.location}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <AttachMoney sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {job.salary}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {job.type}
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          <Typography variant="body2" color="text.secondary" mb={2}>
            {job.description.substring(0, 150)}...
          </Typography>

          {/* Skills */}
          <Box mb={2}>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {job.skills.slice(0, 3).map((skill, index) => (
                <Chip key={index} label={skill} size="small" variant="outlined" />
              ))}
              {job.skills.length > 3 && (
                <Chip label={`+${job.skills.length - 3} more`} size="small" />
              )}
            </Box>
          </Box>

          {/* Actions */}
          <Box display="flex" gap={1}>
            {hasRole('STUDENT') && (
              <Button
                variant="contained"
                onClick={() => onApply(job)}
                sx={{ flexGrow: 1 }}
              >
                Apply Now
              </Button>
            )}
            <Button variant="outlined" onClick={() => {}}>
              View Details
            </Button>
            <IconButton>
              <Share />
            </IconButton>
          </Box>

          {/* Posted Date */}
          <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', top: 8, right: 16 }}>
            {job.postedDate}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Job Posting Dialog (for recruiters)
function JobPostingDialog({ open, onClose, onSubmit }) {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    type: '',
    skills: '',
  });

  const handleSubmit = () => {
    onSubmit(jobData);
    onClose();
    setJobData({
      title: '',
      description: '',
      requirements: '',
      location: '',
      salary: '',
      type: '',
      skills: '',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Post New Job</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Job Title"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={jobData.location}
              onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Salary Range"
              value={jobData.salary}
              onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Job Type</InputLabel>
              <Select
                value={jobData.type}
                label="Job Type"
                onChange={(e) => setJobData({ ...jobData, type: e.target.value })}
              >
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Job Description"
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Requirements"
              value={jobData.requirements}
              onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Required Skills (comma separated)"
              value={jobData.skills}
              onChange={(e) => setJobData({ ...jobData, skills: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Post Job
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function JobsPage() {
  const { hasRole } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [jobPostingOpen, setJobPostingOpen] = useState(false);

  const jobsPerPage = 9;

  // Sample job data - this would come from your API
  const sampleJobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      salary: '$80,000 - $120,000',
      type: 'Full-time',
      description: 'We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for developing user-facing web applications using modern JavaScript frameworks.',
      skills: ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript'],
      postedDate: '2 days ago',
    },
    {
      id: 2,
      title: 'Backend Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$90,000 - $130,000',
      type: 'Full-time',
      description: 'Join our backend team to build scalable and robust server-side applications. Experience with microservices and cloud platforms preferred.',
      skills: ['Java', 'Spring Boot', 'MySQL', 'AWS', 'Docker'],
      postedDate: '1 day ago',
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Innovation Labs',
      location: 'New York, NY',
      salary: '$85,000 - $125,000',
      type: 'Full-time',
      description: 'Looking for a versatile Full Stack Developer who can work on both frontend and backend technologies to deliver complete solutions.',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
      postedDate: '3 days ago',
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'Data Insights Co.',
      location: 'Boston, MA',
      salary: '$95,000 - $140,000',
      type: 'Full-time',
      description: 'Seeking a Data Scientist to analyze large datasets and derive actionable insights for business decision-making.',
      skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow'],
      postedDate: '1 week ago',
    },
    {
      id: 5,
      title: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'Los Angeles, CA',
      salary: '$70,000 - $100,000',
      type: 'Full-time',
      description: 'Creative UI/UX Designer needed to create intuitive and engaging user experiences for web and mobile applications.',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
      postedDate: '4 days ago',
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'Cloud Solutions Inc.',
      location: 'Seattle, WA',
      salary: '$100,000 - $150,000',
      type: 'Full-time',
      description: 'DevOps Engineer to manage and optimize our cloud infrastructure and deployment pipelines.',
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins'],
      postedDate: '5 days ago',
    },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setJobs(sampleJobs);
          setTotalPages(Math.ceil(sampleJobs.length / jobsPerPage));
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = (job) => {
    console.log('Applying to job:', job);
    // Handle job application logic
  };

  const handleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const handleJobPost = (jobData) => {
    console.log('Posting job:', jobData);
    // Handle job posting logic
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter === '' || job.location.toLowerCase().includes(locationFilter.toLowerCase())) &&
      (typeFilter === '' || job.type === typeFilter)
    );
  });

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {hasRole('RECRUITER') ? 'Manage Jobs' : 'Find Your Dream Job'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {hasRole('RECRUITER') 
              ? 'Post new positions and manage existing job listings'
              : `Discover amazing opportunities from ${jobs.length} available positions`
            }
          </Typography>
        </Box>
        {hasRole('RECRUITER') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setJobPostingOpen(true)}
            size="large"
          >
            Post New Job
          </Button>
        )}
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search jobs, companies, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Job Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                sx={{ height: 56 }}
              >
                Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box mb={3}>
        <Typography variant="body1" color="text.secondary">
          Showing {paginatedJobs.length} of {filteredJobs.length} jobs
        </Typography>
      </Box>

      {/* Job Cards Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <Typography>Loading jobs...</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} mb={4}>
            {paginatedJobs.map((job, index) => (
              <Grid item xs={12} md={6} lg={4} key={job.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <JobCard
                    job={job}
                    onApply={handleApply}
                    onSave={handleSaveJob}
                    isSaved={savedJobs.has(job.id)}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Job Posting Dialog */}
      <JobPostingDialog
        open={jobPostingOpen}
        onClose={() => setJobPostingOpen(false)}
        onSubmit={handleJobPost}
      />

      {/* Floating Action Button for mobile */}
      {hasRole('RECRUITER') && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16, display: { md: 'none' } }}
          onClick={() => setJobPostingOpen(true)}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
}

export default JobsPage;