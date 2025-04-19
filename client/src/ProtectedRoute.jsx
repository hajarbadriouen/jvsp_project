// ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';  // Import Navigate instead of Redirect

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');  // Example check for token

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;  // Redirect to login page if not authenticated
  }

  return children;  // Render the protected page if authenticated
};

export default ProtectedRoute;
