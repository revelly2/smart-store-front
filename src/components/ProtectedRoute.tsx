
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'cashier';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // If still loading auth state, show nothing yet
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && user.role !== requiredRole) {
    const redirectTo = user.role === 'admin' ? '/admin' : '/cashier';
    return <Navigate to={redirectTo} replace />;
  }

  // If all checks pass, render children
  return <>{children}</>;
};

export default ProtectedRoute;
