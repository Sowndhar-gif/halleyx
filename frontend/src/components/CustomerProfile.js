import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CustomerProfile = () => {
  const { currentCustomer, customerToken, getAuthHeaders } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentCustomer) {
      setFormData({
        firstName: currentCustomer.firstName || '',
        lastName: currentCustomer.lastName || '',
        email: currentCustomer.email || ''
      });
    }
  }, [currentCustomer]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`/api/customers/${currentCustomer._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(customerToken),
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="profileFirstName">First Name</label>
        <input
          type="text"
          id="profileFirstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        
        <label htmlFor="profileLastName">Last Name</label>
        <input
          type="text"
          id="profileLastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
        
        <label htmlFor="profileEmail">Email</label>
        <input
          type="email"
          id="profileEmail"
          name="email"
          value={formData.email}
          disabled
        />
        
        {error && (
          <div style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            {success}
          </div>
        )}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default CustomerProfile; 