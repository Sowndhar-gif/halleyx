import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminAuth = () => {
  console.log('AdminAuth rendered');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginAdmin } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(formData.email, formData.password);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        
        {error && (
          <div style={{ 
            color: 'var(--secondary)', 
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <label htmlFor="adminEmail">Email</label>
        <input
          type="email"
          id="adminEmail"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          placeholder="admin@example.com"
        />
        
        <label htmlFor="adminPassword">Password</label>
        <input
          type="password"
          id="adminPassword"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          placeholder="Your password"
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminAuth; 