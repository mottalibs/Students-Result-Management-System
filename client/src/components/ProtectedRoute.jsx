import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/axiosInstance';

/**
 * ProtectedRoute - Protects routes from unauthenticated access
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if authenticated
 * @param {string} props.requiredRole - Optional role requirement ('admin' | 'teacher')
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
    const location = useLocation();
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
        // Redirect to login, preserving the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Check role if required
    if (requiredRole) {
        const user = getUser();
        if (user?.role !== requiredRole && user?.role !== 'admin') {
            // Admin can access everything, but teacher can only access teacher routes
            return <Navigate to="/login" replace />;
        }
    }
    
    return children;
};

export default ProtectedRoute;
