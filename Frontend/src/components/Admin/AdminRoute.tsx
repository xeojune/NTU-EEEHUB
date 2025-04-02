import React from 'react';
import { Navigate } from 'react-router';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // If there's no access token or user is not an admin, redirect to admin login
  if (!accessToken || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // If user is authenticated and is an admin, render the protected component
  return <>{children}</>;
};

export default AdminRoute;