import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  TextField,
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  Edit,
  Delete,
  GetApp,
  Timeline,
  Business,
  Work,
  Schedule,
  CheckCircle,
  Cancel,
  Pending,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { applicationAPI, workflowAPI } from '../services/api';

// Application Status Colors
const getStatusColor = (status) => {
  const colors = {
    'PENDING': '#ed6c02',
    'UNDER_REVIEW': '#1976d2',
    'INTERVIEW_SCHEDULED': '#2e7d32',
    'INTERVIEW_COMPLETED': '#9c27b0',
    'OFFERED': '#4caf50',
    'REJECTED': '#f44336',
    'WITHDRAWN': '#757575',
    'HIRED': '#4caf50',
  };
  return colors[status] || '#757575';
};

// Workflow Steps
const workflowSteps = [
  'Application Submitted',
  'Initial Review',
  'Technical Assessment',
  'HR Interview',
  'Technical Interview',
  'Manager Interview',
  'Background Check',
  'Final Decision',
];

// Application Card Component
function ApplicationCard({ application, onViewDetails, onWithdraw }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: '#1976d2' }}>
                <Business />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {application.jobTitle}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {application.company}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          </Box>

          {/* Status */}
          <Box mb={2}>
            <Chip
              label={application.status.replace('_', ' ')}
              sx={{
                bgcolor: getStatusColor(application.status),
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </Box>

          {/* Progress */}
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Application Progress</Typography>
              <Typography variant="body2" fontWeight="bold">
                {Math.round((application.workflowStep / workflowSteps.length) * 100)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(application.workflowStep / workflowSteps.length) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {/* Details */}
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Applied: {application.appliedDate}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Location: {application.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Type: {application.jobType}
            </Typography>
          </Box>

          {/* Actions */}
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Visibility />}
              onClick={() => onViewDetails(application)}
            >
              View Details
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Timeline />}
              onClick={() => {}}
            >
              Track Progress
            </Button>
          </Box>

          {/* Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { onViewDetails(application); handleMenuClose(); }}>
              <Visibility sx={{ mr: 1 }} />
              View Details
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); }}>
              <GetApp sx={{ mr: 1 }} />
              Download Application
            </MenuItem>
            <MenuItem onClick={() => { onWithdraw(application.id); handleMenuClose(); }} sx={{ color: 'error.main' }}>
              <Cancel sx={{ mr: 1 }} />
              Withdraw Application
            </MenuItem>
          </Menu>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Application Details Dialog
function ApplicationDetailsDialog({ open, onClose, application }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (application) {
      setActiveStep(application.workflowStep || 0);
    }
  }, [application]);

  if (!application) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Application Details - {application.jobTitle}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Job Information
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">Company</Typography>
              <Typography variant="body1">{application.company}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">Position</Typography>
              <Typography variant="body1">{application.jobTitle}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">Location</Typography>
              <Typography variant="body1">{application.location}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">Applied Date</Typography>
              <Typography variant="body1">{application.appliedDate}</Typography>
            </Box>
          </Grid>

          {/* Status & Progress */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Application Status
            </Typography>
            <Box mb={2}>
              <Chip
                label={application.status.replace('_', ' ')}
                sx={{
                  bgcolor: getStatusColor(application.status),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Last Updated: {application.lastUpdated || 'Today'}
              </Typography>
            </Box>
          </Grid>

          {/* Workflow Progress */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Application Workflow
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
              {workflowSteps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>

          {/* Additional Notes */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Notes from Recruiter
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={application.notes || 'No notes yet from the recruiter.'}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={() => {}}>
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ApplicationsPage() {
  const { hasRole } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Sample application data
  const sampleApplications = [
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      jobType: 'Full-time',
      status: 'UNDER_REVIEW',
      workflowStep: 2,
      appliedDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      notes: 'Great candidate! Technical skills look promising. Moving to next round.',
    },
    {
      id: 2,
      jobTitle: 'Backend Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      jobType: 'Full-time',
      status: 'INTERVIEW_SCHEDULED',
      workflowStep: 4,
      appliedDate: '2024-01-10',
      lastUpdated: '2024-01-18',
      notes: 'Interview scheduled for next Monday. Please prepare system design questions.',
    },
    {
      id: 3,
      jobTitle: 'Full Stack Developer',
      company: 'Innovation Labs',
      location: 'New York, NY',
      jobType: 'Full-time',
      status: 'PENDING',
      workflowStep: 1,
      appliedDate: '2024-01-20',
      lastUpdated: '2024-01-20',
      notes: '',
    },
    {
      id: 4,
      jobTitle: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'Los Angeles, CA',
      jobType: 'Contract',
      status: 'OFFERED',
      workflowStep: 7,
      appliedDate: '2024-01-05',
      lastUpdated: '2024-01-22',
      notes: 'Excellent portfolio! Offering position with competitive package.',
    },
    {
      id: 5,
      jobTitle: 'Data Scientist',
      company: 'Data Insights Co.',
      location: 'Boston, MA',
      jobType: 'Full-time',
      status: 'REJECTED',
      workflowStep: 3,
      appliedDate: '2024-01-01',
      lastUpdated: '2024-01-15',
      notes: 'Strong technical background but looking for more ML experience.',
    },
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setApplications(sampleApplications);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDetailsOpen(true);
  };

  const handleWithdraw = (applicationId) => {
    // Handle application withdrawal
    console.log('Withdrawing application:', applicationId);
  };

  const filterApplicationsByStatus = (status) => {
    if (status === 'ALL') return applications;
    return applications.filter(app => app.status === status);
  };

  const getApplicationsByTab = () => {
    const tabs = ['ALL', 'PENDING', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED', 'OFFERED', 'REJECTED'];
    return filterApplicationsByStatus(tabs[activeTab]);
  };

  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'PENDING').length,
      inReview: applications.filter(app => app.status === 'UNDER_REVIEW').length,
      interviews: applications.filter(app => app.status === 'INTERVIEW_SCHEDULED').length,
      offers: applications.filter(app => app.status === 'OFFERED').length,
    };
    return stats;
  };

  const stats = getStatusStats();
  const displayedApplications = getApplicationsByTab();

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {hasRole('RECRUITER') ? 'Manage Applications' : 'My Applications'}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {hasRole('RECRUITER') 
            ? 'Review and manage job applications from candidates'
            : `Track your job applications and their progress`
          }
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#1976d2' }}>
                  <Work />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Applications
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#ed6c02' }}>
                  <Pending />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Review
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#1976d2' }}>
                  <Visibility />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.inReview}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Under Review
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#2e7d32' }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.interviews}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Interviews
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#4caf50' }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.offers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Offers Received
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Applications" />
          <Tab label="Pending" />
          <Tab label="Under Review" />
          <Tab label="Interviews" />
          <Tab label="Offers" />
          <Tab label="Rejected" />
        </Tabs>
      </Card>

      {/* Applications Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <Typography>Loading applications...</Typography>
        </Box>
      ) : displayedApplications.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={8}>
              <Work sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No applications found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeTab === 0 
                  ? "You haven't applied to any jobs yet. Start browsing and apply!"
                  : "No applications with this status."
                }
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {displayedApplications.map((application, index) => (
            <Grid item xs={12} md={6} lg={4} key={application.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ApplicationCard
                  application={application}
                  onViewDetails={handleViewDetails}
                  onWithdraw={handleWithdraw}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Application Details Dialog */}
      <ApplicationDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        application={selectedApplication}
      />
    </Box>
  );
}

export default ApplicationsPage;