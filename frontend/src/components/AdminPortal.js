import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminAuth from './AdminAuth';
import AdminDashboard from './AdminDashboard';

const AdminPortal = () => {
  const { currentAdmin } = useAuth();
  console.log('AdminPortal rendered, currentAdmin:', currentAdmin);

  return (
    <div>
      <h1>Admin Portal</h1>
      {!currentAdmin ? (
        <AdminAuth />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
};

export default AdminPortal; 