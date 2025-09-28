import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
} from '@mui/material';
import {
  Block,
  Home,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

function UnauthorizedPage() {
  const navigate = useNavigate();

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
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={10}
            sx={{
              padding: 4,
              borderRadius: 3,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Block sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            </motion.div>
            
            <Typography variant="h4" fontWeight="bold" color="error.main" gutterBottom>
              Access Denied
            </Typography>
            
            <Typography variant="h6" color="text.secondary" gutterBottom>
              403 - Unauthorized
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              You don't have permission to access this page. Please contact your administrator 
              if you believe this is an error.
            </Typography>
            
            <Box mt={4}>
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={() => navigate('/dashboard')}
                size="large"
                sx={{
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                  },
                }}
              >
                Go to Dashboard
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default UnauthorizedPage;