import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminStats from './AdminStats';
import AdminProductManagement from './AdminProductManagement';
import AdminCustomerManagement from './AdminCustomerManagement';
import AdminOrderManagement from './AdminOrderManagement';

const AdminDashboard = () => {
  const { logoutAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState('stats');

  return (
    <div>
      <h2>Dashboard</h2>
      
      <button onClick={logoutAdmin} style={{ marginBottom: '1rem' }}>
        Logout
      </button>

      {/* Navigation Tabs */}
      <div className="tabs" style={{ marginTop: '2rem' }}>
        <div 
          className={`tab ${activeSection === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveSection('stats')}
        >
          Stats
        </div>
        <div 
          className={`tab ${activeSection === 'products' ? 'active' : ''}`}
          onClick={() => setActiveSection('products')}
        >
          Products
        </div>
        <div 
          className={`tab ${activeSection === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveSection('customers')}
        >
          Customers
        </div>
        <div 
          className={`tab ${activeSection === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveSection('orders')}
        >
          Orders
        </div>
      </div>

      {/* Content Sections */}
      <div style={{ marginTop: '2rem' }}>
        {activeSection === 'stats' && <AdminStats />}
        {activeSection === 'products' && <AdminProductManagement />}
        {activeSection === 'customers' && <AdminCustomerManagement />}
        {activeSection === 'orders' && <AdminOrderManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard; 