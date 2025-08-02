import React, { useState } from 'react';
import AdminAuth from './components/AdminAuth';
import AIChatWidget from './components/AIChatWidget';
import CustomerDashboard from './components/CustomerDashboard';

function App() {
  const [tab, setTab] = useState('customer');
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleCheckout = () => {
    // Placeholder for checkout logic
    alert('Proceeding to checkout...');
  };

  return (
    <div className={`container ${theme}`}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <div className="tabs">
          <button
            className={tab === 'customer' ? 'tab active' : 'tab'}
            onClick={() => setTab('customer')}
          >
            Customer Portal
          </button>
          <button
            className={tab === 'admin' ? 'tab active' : 'tab'}
            onClick={() => setTab('admin')}
          >
            Admin Portal
          </button>
        </div>
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>
      <main style={{ marginTop: '2rem', padding: '0 1rem' }}>
        {tab === 'customer' ? <CustomerDashboard onCheckout={handleCheckout} /> : <AdminAuth />}
      </main>
      <AIChatWidget />
    </div>
  );
}

export default App;
