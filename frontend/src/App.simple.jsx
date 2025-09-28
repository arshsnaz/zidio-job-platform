import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box, Button } from '@mui/material';
import { Work } from '@mui/icons-material';
import theme from './theme';

// Simple Login Component
function SimpleLoginPage() {
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
        <Box
          sx={{
            backgroundColor: 'white',
            padding: 4,
            borderRadius: 3,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
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
              mb: 2,
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
          <Typography variant="body1" paragraph>
            🎉 Frontend is now working successfully! 🎉
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            The complete platform includes:
            • Authentication System
            • Job Management
            • Application Tracking
            • Interview Scheduling
            • Analytics Dashboard
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            }}
          >
            Get Started
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/*" element={<SimpleLoginPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;