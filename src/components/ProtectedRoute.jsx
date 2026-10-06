import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute component:
 * - Redirects to /login if user is not authenticated.
 * - Redirects to / if user role is not authorized.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If user is not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role restriction exists and user does not have required role
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If vendor tries to access super_admin, redirect to vendor dashboard
    if (user.role === 'VENDOR') {
      return <Navigate to="/vendor/orders" replace />;
    }
    // Otherwise redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
