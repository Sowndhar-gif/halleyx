import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useAuth } from '../contexts/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminStats = () => {
  const { adminToken, getAuthHeaders } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Wrap loadStats in useCallback to prevent it from changing on every render,
  // which would cause useEffect to re-run unnecessarily.
  const loadStats = useCallback(async () => {
    if (!adminToken) {
      setLoading(false); // Stop loading if no adminToken
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/settings/admin-dashboard', {
        headers: getAuthHeaders(adminToken)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load dashboard stats');
      }

      setStats(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [adminToken, getAuthHeaders]); // Dependencies for useCallback

  useEffect(() => {
    loadStats();
  }, [adminToken, loadStats]); // Added loadStats to dependency array

  if (loading) {
    return <div>Loading dashboard stats...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--secondary)' }}>Error: {error}</div>;
  }

  if (!stats) {
    return <div>No stats available.</div>;
  }

  // Mock product sales data for the chart
  const productSalesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Product Sales',
        data: [120, 190, 300, 250, 400, 350],
        backgroundColor: 'rgba(57, 73, 171, 0.7)'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Product Sales Analysis'
      }
    }
  };

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'var(--input-bg)',
          padding: '1rem',
          borderRadius: '12px',
          border: '2px solid var(--primary)',
          textAlign: 'center'
        }}>
          <h3>Total Products</h3>
          <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>
            {stats.totalProducts || 0}
          </div>
        </div>

        <div style={{
          background: 'var(--input-bg)',
          padding: '1rem',
          borderRadius: '12px',
          border: '2px solid var(--primary)',
          textAlign: 'center'
        }}>
          <h3>Total Customers</h3>
          <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>
            {stats.totalCustomers || 0}
          </div>
        </div>

        <div style={{
          background: 'var(--input-bg)',
          padding: '1rem',
          borderRadius: '12px',
          border: '2px solid var(--primary)',
          textAlign: 'center'
        }}>
          <h3>Total Orders</h3>
          <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>
            {stats.totalOrders || 0}
          </div>
        </div>
      </div>

      {stats.ordersByStatus && (
        <div style={{
          background: 'var(--input-bg)',
          padding: '1rem',
          borderRadius: '12px',
          border: '2px solid var(--primary)',
          marginTop: '2rem' // Added margin for spacing
        }}>
          <h3>Orders by Status</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div>
              <strong>Pending:</strong> {stats.ordersByStatus.Pending || 0}
            </div>
            <div>
              <strong>Processing:</strong> {stats.ordersByStatus.Processing || 0}
            </div>
            <div>
              <strong>Shipped:</strong> {stats.ordersByStatus.Shipped || 0}
            </div>
            {/* Add other statuses if applicable, e.g., Delivered, Cancelled */}
            <div>
              <strong>Delivered:</strong> {stats.ordersByStatus.Delivered || 0}
            </div>
            <div>
              <strong>Cancelled:</strong> {stats.ordersByStatus.Cancelled || 0}
            </div>
          </div>
        </div>
      )}

      {/* Product Sales Analysis Chart */}
      <div style={{
        background: 'var(--input-bg)',
        padding: '1rem',
        borderRadius: '12px',
        border: '2px solid var(--primary)',
        marginTop: '2rem'
      }}>
        <Bar options={options} data={productSalesData} />
      </div>
    </div>
  );
};

export default AdminStats;