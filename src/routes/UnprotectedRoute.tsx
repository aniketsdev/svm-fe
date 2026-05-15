import React from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { clearAuthStorage } from '../features/auth/utils/clearAuthStorage';

interface UnprotectedRouteProps {
  children: React.ReactNode;
}

const UnprotectedRoute: React.FC<UnprotectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, checkUserIdMatch } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Special handling for set-password route
  if (location.pathname.includes('/set-password')) {
    // Allow access when arriving from forgot-password flow with a token in state
    const stateToken = (location.state as { token?: string })?.token;
    if (stateToken) {
      return <>{children}</>;
    }

    // Allow access when arriving from invitation link with ?token= in URL
    const urlToken = searchParams.get('token');
    if (urlToken) {
      return <>{children}</>;
    }

    const urlUserId = searchParams.get('userId');

    // If we have a userId in URL, validate against current auth
    if (urlUserId) {
      // If authenticated, check user match
      if (isAuthenticated && user) {
        // Get current user ID from localStorage
        const currentUserId = localStorage.getItem('userId');

        // Double check: validate both through auth context and localStorage
        if (!checkUserIdMatch(urlUserId) || (currentUserId && currentUserId !== urlUserId)) {
          // Different user - clear ALL auth data and reload
          clearAuthStorage();
          window.location.reload();
          return null;
        } else {
          // If userId matches, redirect to dashboard
          return <Navigate to="/admin/dashboard" replace />;
        }
      }
      // Not authenticated - allow access to set password page
      return <>{children}</>;
    }
    // No userId in URL and no token in state/URL - redirect to login
    return <Navigate to="/clinician/login" replace />;
  }

  // For other unprotected routes (login, forgot password)
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default UnprotectedRoute;