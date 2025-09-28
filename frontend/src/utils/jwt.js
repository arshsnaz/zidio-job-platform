/**
 * JWT utility functions for token handling
 */

// Decode JWT token without verification (client-side only)
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Get user info from token
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    id: decoded.id || decoded.sub,
    email: decoded.email || decoded.sub,
    name: decoded.name,
    role: decoded.role,
    exp: decoded.exp,
    iat: decoded.iat,
  };
};

// Check if user has specific role
export const hasRole = (token, role) => {
  const user = getUserFromToken(token);
  return user?.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (token, roles) => {
  const user = getUserFromToken(token);
  return user?.role && roles.includes(user.role);
};