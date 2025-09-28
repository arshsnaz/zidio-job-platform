import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box, Button, TextField, Paper, AppBar, Toolbar, Avatar, Menu, MenuItem, Card, CardContent, Grid, Chip, LinearProgress } from '@mui/material';
import { Work, Dashboard, Business, Assignment, Interview, Analytics, Logout, Person, Add } from '@mui/icons-material';
import theme from './theme';

// Simple Auth Context
const AuthContext = React.createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Login Page
function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo login
    const userData = {
      id: 1,
      name: 'Demo User',
      email: formData.email,
      role: 'STUDENT',
      avatar: '/api/placeholder/40/40'
    };
    login(userData);
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            padding: 4,
            borderRadius: 3,
            textAlign: 'center',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              mb: 3,
            }}
          >
            <Work sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            ZIDIO Connect
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Internship & Job Management Portal
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
              required
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                height: 56,
              }}
            >
              Sign In
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Demo: Use any email and password to login
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

// Dashboard Layout
function DashboardLayout({ children }) {
  const { user, logout } = React.useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { label: 'Jobs', icon: <Business />, path: '/jobs' },
    { label: 'Applications', icon: <Assignment />, path: '/applications' },
    { label: 'Interviews', icon: <Interview />, path: '/interviews' },
    { label: 'Analytics', icon: <Analytics />, path: '/analytics' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Work sx={{ mr: 2 }} />
            <Typography variant="h6" fontWeight="bold">
              ZIDIO Connect
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  borderRadius: 2 
                }}
              >
                {item.label}
              </Button>
            ))}
            
            <Avatar
              onClick={handleProfileMenu}
              sx={{ 
                cursor: 'pointer',
                width: 40,
                height: 40,
                bgcolor: 'secondary.main'
              }}
            >
              <Person />
            </Avatar>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem disabled>
                <Typography variant="subtitle2">{user?.name}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}

// Dashboard Page
function DashboardPage() {
  const { user } = React.useContext(AuthContext);
  
  const stats = [
    { title: 'Active Applications', value: '12', color: '#1976d2' },
    { title: 'Interviews Scheduled', value: '3', color: '#388e3c' },
    { title: 'Jobs Available', value: '48', color: '#f57c00' },
    { title: 'Profile Views', value: '156', color: '#7b1fa2' },
  ];

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Here's what's happening with your job search today.
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Applications
                </Typography>
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Software Engineer Intern at TechCorp
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Applied 2 days ago
                    </Typography>
                    <Chip label="Under Review" color="warning" size="small" sx={{ mt: 1 }} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Interviews
                </Typography>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Frontend Developer Interview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tomorrow at 2:00 PM
                  </Typography>
                  <LinearProgress variant="determinate" value={75} sx={{ mt: 1 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}

// Jobs Page
function JobsPage() {
  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Internship',
      salary: '$15/hour',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80,000',
      posted: '1 week ago'
    },
    {
      id: 3,
      title: 'Backend Engineer Intern',
      company: 'DataCorp',
      location: 'New York, NY',
      type: 'Internship',
      salary: '$18/hour',
      posted: '3 days ago'
    }
  ];

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Job Opportunities
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)' }}
          >
            Post New Job
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} md={6} lg={4} key={job.id}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { elevation: 8 } }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {job.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    📍 {job.location}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={job.type} color="primary" size="small" />
                    <Chip label={job.salary} variant="outlined" size="small" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Posted {job.posted}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" fullWidth>
                      Apply Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </DashboardLayout>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/interviews" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;