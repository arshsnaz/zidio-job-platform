import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Work,
  Email,
  Lock,
  Person,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      setError('root', { message: result.error });
    }
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
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
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
              </motion.div>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                ZIDIO Connect
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Internship & Job Management Portal
              </Typography>
            </Box>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* Error Alert */}
                {errors.root && (
                  <Grid item xs={12}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {errors.root.message}
                      </Alert>
                    </motion.div>
                  </Grid>
                )}

                {/* Email Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                {/* Password Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                {/* Remember Me */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                </Grid>

                {/* Login Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                      },
                    }}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Grid>

                {/* Divider */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography color="text.secondary" variant="body2">
                      OR
                    </Typography>
                  </Divider>
                </Grid>

                {/* Register Link */}
                <Grid item xs={12} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      style={{
                        color: '#1976d2',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Create Account
                    </Link>
                  </Typography>
                </Grid>

                {/* Demo Accounts */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" fontWeight="600" gutterBottom>
                      Demo Accounts:
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Student:</strong> student@demo.com / password123
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Recruiter:</strong> recruiter@demo.com / password123
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Admin:</strong> admin@demo.com / password123
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default LoginPage;