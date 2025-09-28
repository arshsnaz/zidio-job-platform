import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Work,
  Email,
  Lock,
  Person,
  Business,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Validation schema
const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .string()
    .oneOf(['STUDENT', 'RECRUITER'], 'Please select a valid role')
    .required('Please select your role'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    const { confirmPassword, terms, ...userData } = data;
    const result = await registerUser(userData);
    if (result.success) {
      navigate('/dashboard', { replace: true });
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
      <Container maxWidth="md">
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
                Join ZIDIO Connect
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Create your account and start your journey
              </Typography>
            </Box>

            {/* Registration Form */}
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

                {/* Full Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
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

                {/* Email */}
                <Grid item xs={12} sm={6}>
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

                {/* Role Selection */}
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.role}>
                    <InputLabel>I am a</InputLabel>
                    <Select
                      label="I am a"
                      {...register('role')}
                      sx={{
                        borderRadius: 2,
                      }}
                      startAdornment={
                        <InputAdornment position="start">
                          <Business color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="STUDENT">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Person />
                          <Box>
                            <Typography variant="body1">Student/Job Seeker</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Looking for internships and job opportunities
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="RECRUITER">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Business />
                          <Box>
                            <Typography variant="body1">Recruiter/Employer</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Posting jobs and hiring candidates
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    </Select>
                    {errors.role && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors.role.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Password */}
                <Grid item xs={12} sm={6}>
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

                {/* Confirm Password */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

                {/* Terms and Conditions */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...register('terms')}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{' '}
                        <Link to="/terms" style={{ color: '#1976d2' }}>
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" style={{ color: '#1976d2' }}>
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                  />
                  {errors.terms && (
                    <Typography variant="caption" color="error" display="block">
                      {errors.terms.message}
                    </Typography>
                  )}
                </Grid>

                {/* Register Button */}
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
                    {isLoading ? 'Creating Account...' : 'Create Account'}
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

                {/* Login Link */}
                <Grid item xs={12} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      style={{
                        color: '#1976d2',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default RegisterPage;