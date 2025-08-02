import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminOrderManagement = () => {
  const { adminToken, getAuthHeaders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, [adminToken]);

  const loadOrders = async () => {
    if (!adminToken) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: 1,
        limit: 20,
        status: statusFilter
      });

      const response = await fetch(`/api/orders?${params.toString()}`, {
        headers: getAuthHeaders(adminToken)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load orders');
      }
      
      setOrders(data.orders || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = () => {
    loadOrders();
  };

  const handleUpdateOrder = async (orderId, orderData) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: getAuthHeaders(adminToken),
        body: JSON.stringify(orderData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order');
      }
      
      alert('Order updated successfully');
      loadOrders();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(adminToken)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete order');
      }
      
      alert('Order deleted successfully');
      loadOrders();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--secondary)' }}>Error: {error}</div>;
  }

  return (
    <div>
      {/* Search and Controls */}
      <div className="search-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} onBlur={handleStatusFilter}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
        </select>
        <button onClick={handleStatusFilter}>Filter</button>
      </div>

      {/* Orders Table */}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Product</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'N/A'}</td>
              <td>{order.status}</td>
              <td>{order.productId ? order.productId.name : 'N/A'}</td>
              <td className="actions">
                <button onClick={() => alert(`Viewing order: ${order._id}`)}>
                  View
                </button>
                <button onClick={() => setEditingOrder(order)}>
                  Update
                </button>
                <button onClick={() => handleDeleteOrder(order._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          No orders found.
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <OrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSubmit={(data) => {
            handleUpdateOrder(editingOrder._id, data);
            setEditingOrder(null);
          }}
        />
      )}
    </div>
  );
};

// Order Modal Component
const OrderModal = ({ order, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    status: order.status,
    quantity: order.quantity,
    shippingAddress: order.shippingAddress,
    billingAddress: order.billingAddress
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      status: formData.status,
      quantity: parseInt(formData.quantity),
      shippingAddress: formData.shippingAddress,
      billingAddress: formData.billingAddress
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Update Order</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="orderStatus">Status</label>
          <select
            id="orderStatus"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
          </select>
          
          <label htmlFor="orderQuantity">Quantity</label>
          <input
            type="number"
            id="orderQuantity"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
          
          <label htmlFor="shippingAddress">Shipping Address</label>
          <textarea
            id="shippingAddress"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleInputChange}
            required
            rows="3"
          />
          
          <label htmlFor="billingAddress">Billing Address</label>
          <textarea
            id="billingAddress"
            name="billingAddress"
            value={formData.billingAddress}
            onChange={handleInputChange}
            required
            rows="3"
          />
          
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default AdminOrderManagement; 