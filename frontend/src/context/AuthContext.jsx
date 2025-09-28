import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, studentAPI, recruiterAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { getUserFromToken, isTokenExpired } from '../utils/jwt';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  role: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
};

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        role: action.payload.user.role,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        role: action.payload?.role,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('zidio_token') || localStorage.getItem('token');

        if (token && !isTokenExpired(token)) {
          const userFromToken = getUserFromToken(token);
          if (userFromToken) {
            try {
              // Get additional user details based on role
              let userDetails = {
                email: userFromToken.email,
                role: userFromToken.role,
              };

              // Try to fetch role-specific details
              try {
                if (userFromToken.role === 'STUDENT') {
                  const studentResponse = await studentAPI.getByEmail(userFromToken.email);
                  userDetails = { ...userDetails, ...studentResponse.data };
                } else if (userFromToken.role === 'RECRUITER') {
                  const recruiterResponse = await recruiterAPI.getByEmail(userFromToken.email);
                  userDetails = { ...userDetails, ...recruiterResponse.data };
                }
              } catch (apiError) {
                console.warn('Unable to fetch additional user details:', apiError.response?.data?.message || apiError.message);
                // Use token data only if API fails
                userDetails = {
                  ...userFromToken,
                  id: userFromToken.id || userFromToken.sub,
                  name: userFromToken.name || userFromToken.email,
                };
              }

              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: {
                  user: userDetails,
                  token: token,
                },
              });
            } catch (error) {
              console.error('Authentication initialization error:', error);
              // Clear invalid tokens and redirect to login
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('zidio_token');
              localStorage.removeItem('zidio_user');
              dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('zidio_token');
            localStorage.removeItem('zidio_user');
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          }
        } else {
          // Token is expired or doesn't exist
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('zidio_token');
          localStorage.removeItem('zidio_user');
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Always set loading to false to prevent infinite loading
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const response = await authAPI.login({ email, password });
      const { token, message } = response.data;

      // Decode token to get user info
      const userFromToken = getUserFromToken(token);
      if (!userFromToken) {
        throw new Error('Invalid token received');
      }

      // Get role-specific user details
      let userDetails = {
        email: userFromToken.email,
        role: userFromToken.role,
      };

      try {
        if (userFromToken.role === 'STUDENT') {
          const studentResponse = await studentAPI.getByEmail(userFromToken.email);
          userDetails = { ...userDetails, ...studentResponse.data };
        } else if (userFromToken.role === 'RECRUITER') {
          const recruiterResponse = await recruiterAPI.getByEmail(userFromToken.email);
          userDetails = { ...userDetails, ...recruiterResponse.data };
        }
      } catch (error) {
        // If role-specific details are not found, continue with basic user info
        console.warn('Could not fetch role-specific details:', error);
      }

      // Store in localStorage
      localStorage.setItem('zidio_token', token);
      localStorage.setItem('zidio_user', JSON.stringify(userDetails));
      // Keep backward compatibility
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userDetails));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: userDetails, token },
      });

      toast.success(`Welcome back, ${userDetails.name || userDetails.email}!`);
      return { success: true, user: userDetails };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const response = await authAPI.register(userData);
      const { token, message } = response.data;

      // Decode token to get user info
      const userFromToken = getUserFromToken(token);
      if (!userFromToken) {
        throw new Error('Invalid token received');
      }

      // Get role-specific user details
      let userDetails = {
        email: userFromToken.email,
        role: userFromToken.role,
        name: userData.name, // Use the name from registration form
      };

      try {
        if (userFromToken.role === 'STUDENT') {
          const studentResponse = await studentAPI.getByEmail(userFromToken.email);
          userDetails = { ...userDetails, ...studentResponse.data };
        } else if (userFromToken.role === 'RECRUITER') {
          const recruiterResponse = await recruiterAPI.getByEmail(userFromToken.email);
          userDetails = { ...userDetails, ...recruiterResponse.data };
        }
      } catch (error) {
        // If role-specific details are not found, continue with basic user info
        console.warn('Could not fetch role-specific details:', error);
      }

      // Store in localStorage
      localStorage.setItem('zidio_token', token);
      localStorage.setItem('zidio_user', JSON.stringify(userDetails));
      // Keep backward compatibility
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userDetails));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: userDetails, token },
      });

      toast.success(`Welcome to ZIDIO Connect, ${userDetails.name || userDetails.email}!`);
      return { success: true, user: userDetails };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // No logout API in backend, just clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('zidio_token');
      localStorage.removeItem('zidio_user');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('zidio_token');
      localStorage.removeItem('zidio_user');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.success('Logged out successfully');
    }
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('zidio_user', JSON.stringify(updatedUser));
    dispatch({ type: AUTH_ACTIONS.SET_USER, payload: updatedUser });
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    if (!state.user || !state.user.role) return false;
    return state.user.role === requiredRole;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!state.user || !state.user.role) return false;
    return roles.includes(state.user.role);
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;