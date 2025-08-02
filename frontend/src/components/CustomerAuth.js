import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CustomerAuth = () => {
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const { loginCustomer, registerCustomer } = useAuth();

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
      if (authMode === 'login') {
        const data = await loginCustomer(formData.email, formData.password);
        // Check if this is the first login from server response
        if (data.isFirstLogin) {
          setIsFirstLogin(true);
          localStorage.setItem('hasLoggedInBefore', 'true');
        } else {
          setIsFirstLogin(false);
          localStorage.removeItem('hasLoggedInBefore');
        }
      } else {
        await registerCustomer(
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.password
        );
        // After successful registration, switch to login mode
        setAuthMode('login');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Auth Mode Toggle */}
      <div className="auth-toggle">
        <button 
          onClick={() => setAuthMode('login')}
          className={authMode === 'login' ? 'auth-toggle-button active' : 'auth-toggle-button'}
        >
          Login
        </button>
        <button 
          onClick={() => setAuthMode('register')}
          className={authMode === 'register' ? 'auth-toggle-button active' : 'auth-toggle-button'}
        >
          Register
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="auth-error-message">
          {error}
        </div>
      )}

      {/* Welcome Message for First Login */}
      {isFirstLogin && (
        <div id="welcomeMessage" className="welcome-message">
          Welcome! This is your first login. Enjoy your experience!
        </div>
      )}

      {/* Login Form */}
      {authMode === 'login' && (
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Login</h2>
          <label htmlFor="loginEmail">Email</label>
          <input
            type="email"
            id="loginEmail"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="you@example.com"
          />
          <label htmlFor="loginPassword">Password</label>
          <input
            type="password"
            id="loginPassword"
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
      )}

      {/* Register Form */}
      {authMode === 'register' && (
        <>
          <h3 className="register-subtitle">Create a new account by filling the form below</h3>
          <form onSubmit={handleSubmit} className="auth-form">
            <h2>Register</h2>
            <label htmlFor="regFirstName">First Name</label>
            <input
              type="text"
              id="regFirstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              placeholder="First Name"
            />
            <label htmlFor="regLastName">Last Name</label>
            <input
              type="text"
              id="regLastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              placeholder="Last Name"
            />
            <label htmlFor="regEmail">Email</label>
            <input
              type="email"
              id="regEmail"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="you@example.com"
            />
            <label htmlFor="regPassword">Password</label>
            <input
              type="password"
              id="regPassword"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Choose a strong password"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CustomerAuth; 