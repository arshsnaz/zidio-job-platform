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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {
  VideoCall,
  LocationOn,
  Schedule,
  Person,
  Business,
  Phone,
  Email,
  Add,
  Edit,
  Cancel,
  CheckCircle,
  AccessTime,
  Event,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../services/api';

// Interview Status Colors
const getInterviewStatusColor = (status) => {
  const colors = {
    'SCHEDULED': '#2e7d32',
    'RESCHEDULED': '#ed6c02',
    'COMPLETED': '#1976d2',
    'CANCELLED': '#f44336',
    'NO_SHOW': '#9e9e9e',
  };
  return colors[status] || '#757575';
};

// Interview Type Icons
const getInterviewTypeIcon = (type) => {
  const icons = {
    'VIDEO_CALL': <VideoCall />,
    'PHONE': <Phone />,
    'IN_PERSON': <LocationOn />,
  };
  return icons[type] || <VideoCall />;
};

// Interview Card Component
function InterviewCard({ interview, onEdit, onCancel, onComplete, onJoin }) {
  const { hasRole } = useAuth();
  const isUpcoming = new Date(interview.dateTime) > new Date();
  const isPast = new Date(interview.dateTime) < new Date();

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
                {getInterviewTypeIcon(interview.type)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {interview.jobTitle}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {interview.company}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={interview.status.replace('_', ' ')}
              sx={{
                bgcolor: getInterviewStatusColor(interview.status),
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </Box>

          {/* Interview Details */}
          <Box mb={2}>
            <Box display="flex" alignItems="center" mb={1}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(interview.dateTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTime sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Duration: {interview.duration} minutes
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Person sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Interviewer: {interview.interviewer}
              </Typography>
            </Box>
            {interview.location && (
              <Box display="flex" alignItems="center" mb={1}>
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {interview.location}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Round Info */}
          <Box mb={2}>
            <Chip
              label={interview.round}
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={interview.type.replace('_', ' ')}
              variant="outlined"
              size="small"
            />
          </Box>

          {/* Notes */}
          {interview.notes && (
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                <strong>Notes:</strong> {interview.notes}
              </Typography>
            </Box>
          )}

          {/* Actions */}
          <Box display="flex" gap={1} flexWrap="wrap">
            {isUpcoming && interview.status === 'SCHEDULED' && (
              <>
                {interview.type === 'VIDEO_CALL' && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<VideoCall />}
                    onClick={() => onJoin(interview)}
                  >
                    Join Call
                  </Button>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => onEdit(interview)}
                >
                  Reschedule
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => onCancel(interview)}
                >
                  Cancel
                </Button>
              </>
            )}
            {isPast && interview.status === 'SCHEDULED' && hasRole('RECRUITER') && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<CheckCircle />}
                onClick={() => onComplete(interview)}
              >
                Mark Complete
              </Button>
            )}
            {interview.status === 'COMPLETED' && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {}}
              >
                View Feedback
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Schedule Interview Dialog
function ScheduleInterviewDialog({ open, onClose, onSubmit, application }) {
  const [interviewData, setInterviewData] = useState({
    dateTime: new Date(),
    duration: 60,
    type: 'VIDEO_CALL',
    round: 'Technical Interview',
    interviewer: '',
    location: '',
    notes: '',
  });

  const handleSubmit = () => {
    onSubmit({ ...interviewData, applicationId: application?.id });
    onClose();
    setInterviewData({
      dateTime: new Date(),
      duration: 60,
      type: 'VIDEO_CALL',
      round: 'Technical Interview',
      interviewer: '',
      location: '',
      notes: '',
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Schedule Interview</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <DateTimePicker
                label="Interview Date & Time"
                value={interviewData.dateTime}
                onChange={(newValue) => setInterviewData({ ...interviewData, dateTime: newValue })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={interviewData.duration}
                onChange={(e) => setInterviewData({ ...interviewData, duration: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Interview Type</InputLabel>
                <Select
                  value={interviewData.type}
                  label="Interview Type"
                  onChange={(e) => setInterviewData({ ...interviewData, type: e.target.value })}
                >
                  <MenuItem value="VIDEO_CALL">Video Call</MenuItem>
                  <MenuItem value="PHONE">Phone Call</MenuItem>
                  <MenuItem value="IN_PERSON">In Person</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Interview Round</InputLabel>
                <Select
                  value={interviewData.round}
                  label="Interview Round"
                  onChange={(e) => setInterviewData({ ...interviewData, round: e.target.value })}
                >
                  <MenuItem value="HR Interview">HR Interview</MenuItem>
                  <MenuItem value="Technical Interview">Technical Interview</MenuItem>
                  <MenuItem value="Manager Interview">Manager Interview</MenuItem>
                  <MenuItem value="Final Interview">Final Interview</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Interviewer"
                value={interviewData.interviewer}
                onChange={(e) => setInterviewData({ ...interviewData, interviewer: e.target.value })}
              />
            </Grid>
            {interviewData.type === 'IN_PERSON' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={interviewData.location}
                  onChange={(e) => setInterviewData({ ...interviewData, location: e.target.value })}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={interviewData.notes}
                onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Schedule Interview
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

function InterviewsPage() {
  const { hasRole } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Sample interview data
  const sampleInterviews = [
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'Tech Corp',
      dateTime: '2024-01-25T14:00:00',
      duration: 60,
      type: 'VIDEO_CALL',
      round: 'Technical Interview',
      interviewer: 'John Smith',
      status: 'SCHEDULED',
      notes: 'Focus on React and JavaScript fundamentals',
    },
    {
      id: 2,
      jobTitle: 'Backend Developer',
      company: 'StartupXYZ',
      dateTime: '2024-01-26T10:00:00',
      duration: 45,
      type: 'PHONE',
      round: 'HR Interview',
      interviewer: 'Sarah Johnson',
      status: 'SCHEDULED',
      notes: 'Initial screening call',
    },
    {
      id: 3,
      jobTitle: 'Full Stack Developer',
      company: 'Innovation Labs',
      dateTime: '2024-01-22T15:30:00',
      duration: 90,
      type: 'IN_PERSON',
      round: 'Final Interview',
      interviewer: 'Mike Chen',
      location: '123 Tech Street, San Francisco',
      status: 'COMPLETED',
      notes: 'Architecture and system design discussion',
    },
    {
      id: 4,
      jobTitle: 'UI/UX Designer',
      company: 'Design Studio',
      dateTime: '2024-01-23T11:00:00',
      duration: 60,
      type: 'VIDEO_CALL',
      round: 'Portfolio Review',
      interviewer: 'Alice Brown',
      status: 'COMPLETED',
      notes: 'Review design portfolio and process',
    },
    {
      id: 5,
      jobTitle: 'Data Scientist',
      company: 'Data Insights Co.',
      dateTime: '2024-01-20T09:00:00',
      duration: 120,
      type: 'VIDEO_CALL',
      round: 'Technical Interview',
      interviewer: 'David Wilson',
      status: 'CANCELLED',
      notes: 'Candidate requested reschedule',
    },
  ];

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setInterviews(sampleInterviews);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const handleScheduleInterview = (interviewData) => {
    console.log('Scheduling interview:', interviewData);
    // Handle interview scheduling logic
  };

  const handleEditInterview = (interview) => {
    console.log('Editing interview:', interview);
  };

  const handleCancelInterview = (interview) => {
    console.log('Cancelling interview:', interview);
  };

  const handleCompleteInterview = (interview) => {
    console.log('Completing interview:', interview);
  };

  const handleJoinInterview = (interview) => {
    console.log('Joining interview:', interview);
    // Open video call link
  };

  const filterInterviewsByTab = () => {
    const now = new Date();
    switch (activeTab) {
      case 0: // Upcoming
        return interviews.filter(interview => 
          new Date(interview.dateTime) > now && interview.status === 'SCHEDULED'
        );
      case 1: // Past
        return interviews.filter(interview => 
          new Date(interview.dateTime) < now || ['COMPLETED', 'CANCELLED'].includes(interview.status)
        );
      case 2: // All
        return interviews;
      default:
        return interviews;
    }
  };

  const getUpcomingStats = () => {
    const upcoming = interviews.filter(interview => 
      new Date(interview.dateTime) > new Date() && interview.status === 'SCHEDULED'
    );
    const today = upcoming.filter(interview => {
      const interviewDate = new Date(interview.dateTime);
      const today = new Date();
      return interviewDate.toDateString() === today.toDateString();
    });
    return { total: upcoming.length, today: today.length };
  };

  const stats = getUpcomingStats();
  const displayedInterviews = filterInterviewsByTab();

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {hasRole('RECRUITER') ? 'Interview Management' : 'My Interviews'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {hasRole('RECRUITER') 
              ? 'Schedule and manage candidate interviews'
              : 'Track your upcoming and past interviews'
            }
          </Typography>
        </Box>
        {hasRole('RECRUITER') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setScheduleDialogOpen(true)}
            size="large"
          >
            Schedule Interview
          </Button>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#2e7d32' }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming Interviews
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#ed6c02' }}>
                  <Event />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.today}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today's Interviews
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#1976d2' }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {interviews.filter(i => i.status === 'COMPLETED').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#f44336' }}>
                  <Cancel />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {interviews.filter(i => i.status === 'CANCELLED').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cancelled
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
        >
          <Tab label="Upcoming" />
          <Tab label="Past" />
          <Tab label="All Interviews" />
        </Tabs>
      </Card>

      {/* Interviews Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <Typography>Loading interviews...</Typography>
        </Box>
      ) : displayedInterviews.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={8}>
              <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No interviews found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeTab === 0 
                  ? "No upcoming interviews scheduled."
                  : activeTab === 1
                  ? "No past interviews to display."
                  : "No interviews have been scheduled yet."
                }
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {displayedInterviews.map((interview, index) => (
            <Grid item xs={12} md={6} lg={4} key={interview.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <InterviewCard
                  interview={interview}
                  onEdit={handleEditInterview}
                  onCancel={handleCancelInterview}
                  onComplete={handleCompleteInterview}
                  onJoin={handleJoinInterview}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Schedule Interview Dialog */}
      <ScheduleInterviewDialog
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        onSubmit={handleScheduleInterview}
        application={selectedApplication}
      />
    </Box>
  );
}

export default InterviewsPage;