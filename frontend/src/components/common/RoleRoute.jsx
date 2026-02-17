import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleRoute({ children, userRole, requiredRole }) {
  return userRole === requiredRole ? children : <Navigate to="/unauthorized" />;
}
