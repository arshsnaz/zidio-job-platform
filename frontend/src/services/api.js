import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance with base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || process.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zidio_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('zidio_token');
      localStorage.removeItem('zidio_user');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    } else if (response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.');
    } else if (response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (response?.data?.message) {
      toast.error(response.data.message);
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Job API endpoints
export const jobAPI = {
  getAllJobs: (params) => api.get('/jobPosts', { params }),
  getJobById: (id) => api.get(`/jobPosts/${id}`),
  createJob: (jobData) => api.post('/jobPosts', jobData),
  updateJob: (id, jobData) => api.put(`/jobPosts/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobPosts/${id}`),
  searchJobsByTitle: (jobTitle) => api.get('/jobPosts/jobTitle', { params: { jobTitle } }),
  getJobsByType: (jobType) => api.get('/jobPosts/jobType', { params: { jobType } }),
  getJobsByCompanyName: (companyName) => api.get('/jobPosts/companyName', { params: { companyName } }),
  getJobsByRecruiter: (email) => api.get('/jobPosts/recruiter', { params: { email } }),
};

// Application API endpoints
export const applicationAPI = {
  getAllApplications: (params) => api.get('/applications', { params }),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  applyToJob: (applicationData) => api.post('/applications/apply', applicationData),
  updateApplicationStatus: (id, status) => api.post(`/applications/${id}/status`, null, { params: { status } }),
  getApplicationsByJob: (jobId) => api.get(`/applications/job/${jobId}`),
  getApplicationsByStudent: (studentId) => api.get(`/applications/student/${studentId}`),
  withdrawApplication: (id) => api.delete(`/applications/${id}`),
};

// Student API endpoints
export const studentAPI = {
  getByEmail: (email) => api.get(`/students/email/${email}`),
  getById: (id) => api.get(`/students/id/${id}`),
  createOrUpdate: (studentData) => api.post('/students', studentData),
};

// Recruiter API endpoints
export const recruiterAPI = {
  register: (recruiterData) => api.post('/recruiters/register', recruiterData),
  getByEmail: (email) => api.get(`/recruiters/${email}`),
  getById: (id) => api.get(`/recruiters/${id}`),
};

// Workflow API endpoints
export const workflowAPI = {
  getApplicationWorkflow: (applicationId) => api.get(`/workflow/application/${applicationId}`),
  transitionWorkflow: (applicationId, action) => api.post(`/workflow/application/${applicationId}/transition`, { action }),
  getWorkflowHistory: (applicationId) => api.get(`/workflow/application/${applicationId}/history`),
  bulkTransition: (data) => api.post('/workflow/bulk-transition', data),
};

// Interview API endpoints
export const interviewAPI = {
  scheduleInterview: (data) => api.post('/interviews/schedule', data),
  rescheduleInterview: (id, data) => api.put(`/interviews/${id}/reschedule`, data),
  completeInterview: (id, data) => api.put(`/interviews/${id}/complete`, data),
  getInterviewsByUser: (userId) => api.get(`/interviews/user/${userId}`),
  getInterviewsByApplication: (applicationId) => api.get(`/interviews/application/${applicationId}`),
  getUpcomingInterviews: () => api.get('/interviews/upcoming'),
  cancelInterview: (id) => api.delete(`/interviews/${id}`),
};

// User API endpoints
export const userAPI = {
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (profileData) => api.put('/users/profile', profileData),
  getUserDashboard: () => api.get('/users/dashboard'),
  getUserNotifications: () => api.get('/users/notifications'),
  markNotificationRead: (notificationId) => api.put(`/users/notifications/${notificationId}/read`),
};

// Analytics API endpoints
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getApplicationStats: () => api.get('/analytics/applications'),
  getJobStats: () => api.get('/analytics/jobs'),
  getInterviewStats: () => api.get('/analytics/interviews'),
  getRecruitmentTrends: () => api.get('/analytics/trends'),
};

// Admin API endpoints
export const adminAPI = {
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, { status }),
  getSystemStats: () => api.get('/admin/stats'),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
  generateReport: (reportType, params) => api.get(`/admin/reports/${reportType}`, { params }),
};

// File upload API
export const fileAPI = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadDocument: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post('/files/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;