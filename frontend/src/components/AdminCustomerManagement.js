import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminCustomerManagement = () => {
  const { adminToken, getAuthHeaders, impersonateCustomer } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadCustomers();
  }, [adminToken]);

  const loadCustomers = async () => {
    if (!adminToken) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: 1,
        limit: 20,
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter
      });

      const response = await fetch(`/api/customers?${params.toString()}`, {
        headers: getAuthHeaders(adminToken)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load customers');
      }
      
      setCustomers(data.customers || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadCustomers();
  };

  const handleToggleBlock = async (customerId, isBlocked) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: getAuthHeaders(adminToken),
        body: JSON.stringify({ isBlocked: !isBlocked })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update customer status');
      }
      
      alert(`Customer ${!isBlocked ? 'blocked' : 'unblocked'} successfully`);
      loadCustomers();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleImpersonate = async (customerId, customerName) => {
    try {
      await impersonateCustomer(customerId, customerName);
      alert('Impersonation started');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div>Loading customers...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--secondary)' }}>Error: {error}</div>;
  }

  return (
    <div>
      {/* Search and Controls */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} onBlur={handleSearch}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Customers Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer._id}>
              <td>{customer.firstName} {customer.lastName}</td>
              <td>{customer.email}</td>
              <td>{customer.isBlocked ? 'Blocked' : 'Active'}</td>
              <td className="actions">
                <button onClick={() => alert(`Viewing customer: ${customer._id}`)}>
                  View
                </button>
                <button onClick={() => handleToggleBlock(customer._id, customer.isBlocked)}>
                  {customer.isBlocked ? 'Unblock' : 'Block'}
                </button>
                <button onClick={() => handleImpersonate(customer._id, `${customer.firstName} ${customer.lastName}`)}>
                  Impersonate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {customers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          No customers found.
        </div>
      )}
    </div>
  );
};

export default AdminCustomerManagement; 