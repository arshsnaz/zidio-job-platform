import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Mail, 
  Lock, 
  Briefcase, 
  ArrowRight,
  CheckCircle,
  Github,
  Chrome,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

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
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: error.message || 'Login failed. Please try again.',
      });
    }
  };

  const socialLogins = [
    { name: 'Google', icon: Chrome, color: 'hover:bg-red-50 hover:border-red-200' },
    { name: 'GitHub', icon: Github, color: 'hover:bg-gray-50 hover:border-gray-200' },
  ];

  const features = [
    'Connect with top companies',
    'Access exclusive job opportunities',
    'Build your professional network',
    'Track your application progress'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ZIDIO Connect
                </h1>
                <p className="text-muted-foreground">Professional Job Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="gradient" className="px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                New Features
              </Badge>
              <Badge variant="outline">Trusted by 10k+ professionals</Badge>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Your Career Journey Starts Here
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join thousands of professionals who have found their dream jobs through our platform. 
              Connect with top companies and unlock exclusive opportunities.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="border-0 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center lg:hidden">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <p className="text-muted-foreground">
                Sign in to your account to continue
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {socialLogins.map((social) => (
                  <Button
                    key={social.name}
                    variant="outline"
                    className={`h-11 ${social.color} transition-all duration-200`}
                  >
                    <social.icon className="h-4 w-4 mr-2" />
                    {social.name}
                  </Button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {errors.root && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  >
                    {errors.root.message}
                  </motion.div>
                )}

                <div className="space-y-4">
                  <Input
                    type="email"
                    label="Email Address"
                    icon={Mail}
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <Input
                    type="password"
                    label="Password"
                    icon={Lock}
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                    />
                    <span className="text-sm text-muted-foreground">Remember me</span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full group"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-primary hover:underline font-semibold"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-muted-foreground mb-3">Trusted by professionals worldwide</p>
            <div className="flex justify-center items-center space-x-6 opacity-60">
              <div className="text-xs font-medium">10k+ Users</div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="text-xs font-medium">500+ Companies</div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="text-xs font-medium">99% Uptime</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;