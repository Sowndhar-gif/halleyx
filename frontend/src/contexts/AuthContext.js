import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [customerToken, setCustomerToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [impersonationToken, setImpersonationToken] = useState(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const storedCustomerToken = localStorage.getItem('customerToken');
    const storedAdminToken = localStorage.getItem('adminToken');
    const storedImpersonationToken = localStorage.getItem('impersonationToken');

    if (storedCustomerToken) {
      setCustomerToken(storedCustomerToken);
    }
    if (storedAdminToken) {
      setAdminToken(storedAdminToken);
    }
    if (storedImpersonationToken) {
      setImpersonationToken(storedImpersonationToken);
      setIsImpersonating(true);
    }
  }, []);

  // Helper to get auth headers
  const getAuthHeaders = (token) => {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };
  };

  // Customer login
  const loginCustomer = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      setCustomerToken(data.token);
      setCurrentCustomer(data.user);
      localStorage.setItem('customerToken', data.token);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Customer register
  const registerCustomer = async (firstName, lastName, email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      // Do not set token or current user here to avoid auto-login after registration
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Admin login
  const loginAdmin = async (email, password) => {
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Admin login failed');
      }
      setAdminToken(data.token);
      setCurrentAdmin(data.user);
      localStorage.setItem('adminToken', data.token);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout customer
  const logoutCustomer = () => {
    setCustomerToken(null);
    setCurrentCustomer(null);
    localStorage.removeItem('customerToken');
  };

  // Logout admin
  const logoutAdmin = () => {
    setAdminToken(null);
    setCurrentAdmin(null);
    localStorage.removeItem('adminToken');
  };

  // Impersonate customer
  const impersonateCustomer = async (customerId, customerName) => {
    try {
      const response = await fetch(`/api/auth/impersonate/${customerId}`, {
        method: 'POST',
        headers: getAuthHeaders(adminToken)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to impersonate customer');
      }
      setImpersonationToken(data.token);
      setCurrentCustomer(data.user);
      setIsImpersonating(true);
      localStorage.setItem('impersonationToken', data.token);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Stop impersonation
  const stopImpersonation = () => {
    setImpersonationToken(null);
    setCurrentCustomer(null);
    setIsImpersonating(false);
    localStorage.removeItem('impersonationToken');
  };

  const value = {
    customerToken,
    adminToken,
    currentCustomer,
    currentAdmin,
    impersonationToken,
    isImpersonating,
    getAuthHeaders,
    loginCustomer,
    registerCustomer,
    loginAdmin,
    logoutCustomer,
    logoutAdmin,
    impersonateCustomer,
    stopImpersonation
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 