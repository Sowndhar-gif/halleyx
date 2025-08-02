import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useAuth } from '../contexts/AuthContext'; // Assuming you use useAuth for customer token

const OrderList = () => {
  const { currentCustomer } = useAuth(); // Assuming you get customer info for orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState('');
  const [trackingInfo, setTrackingInfo] = useState({}); // Example for tracking info

  // loadOrders function
  const loadOrders = useCallback(async () => {
    if (!currentCustomer?.token) { // Assuming customer token is needed
      setLoadingOrders(false);
      return;
    }
    try {
      setLoadingOrders(true);
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${currentCustomer.token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }
      setOrders(data);
    } catch (err) {
      setErrorOrders(err.message);
    } finally {
      setLoadingOrders(false);
    }
  }, [currentCustomer]); // Dependencies for loadOrders

  // loadTrackingInfo function (example)
  const loadTrackingInfo = useCallback(async (orderId) => {
    // This function would likely take an orderId and fetch tracking details
    // For demonstration, let's just simulate.
    if (!currentCustomer?.token) {
        return;
    }
    try {
        // Simulate API call
        // const response = await fetch(`/api/orders/${orderId}/tracking`, { /* headers */ });
        // const data = await response.json();
        setTrackingInfo(prev => ({ ...prev, [orderId]: `Tracking info for ${orderId}` }));
    } catch (err) {
        console.error("Error fetching tracking info:", err);
    }
  }, [currentCustomer]); // Dependencies for loadTrackingInfo


  useEffect(() => {
    loadOrders();
  }, [loadOrders]); // Dependency added for loadOrders

  // This is a hypothetical second useEffect for loadTrackingInfo based on your error.
  // You might have this tied to individual order display or another condition.
  // I'm assuming it's related to fetching tracking for *all* orders after they load.
  useEffect(() => {
    // This part might vary greatly based on your actual implementation.
    // If loadTrackingInfo is called for each order, you might iterate through orders.
    // For now, just including it as per the error message.
    // Example: orders.forEach(order => loadTrackingInfo(order.id));
    // Or it might be triggered when an individual order is expanded.
    // If it's not meant to run on component mount for all orders, you might remove this useEffect
    // and call loadTrackingInfo elsewhere (e.g., inside an onClick handler).
    // If it is meant to run based on some criteria, that criteria should be in dependencies.
    // For now, I'll add it as if it's meant to be called at some point, and needs to be stable.
    if (orders.length > 0) {
      // This is a placeholder; you'd likely call loadTrackingInfo with an actual order ID.
      // e.g., orders.forEach(order => loadTrackingInfo(order.id));
    }
  }, [loadTrackingInfo, orders]); // Dependencies added for loadTrackingInfo and orders

  if (loadingOrders) {
    return <div>Loading orders...</div>;
  }

  if (errorOrders) {
    return <div style={{ color: 'var(--secondary)' }}>Error: {errorOrders}</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div>
      <h3>Your Orders</h3>
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <h4>Order ID: {order.id}</h4>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total}</p>
          {/* Example of showing tracking info */}
          {trackingInfo[order.id] && <p>Tracking: {trackingInfo[order.id]}</p>}
          {/* Example button to load tracking info for a specific order */}
          <button onClick={() => loadTrackingInfo(order.id)}>View Tracking</button>
        </div>
      ))}
    </div>
  );
};

export default OrderList;