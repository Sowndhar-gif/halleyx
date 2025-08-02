import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const CheckoutForm = ({ onClose }) => {
  const { customerToken, getAuthHeaders } = useAuth();
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    billingAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      // Place orders for each item in cart
        for (const [productId, quantity] of Object.entries(cart)) {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: getAuthHeaders(customerToken),
            body: JSON.stringify({
              productId,
              quantity,
              billingAddress: formData.billingAddress
            })
          });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to place order');
        }
      }

      alert('Order placed successfully!');
      clearCart();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
        <button 
          className="close-btn"
          onClick={onClose}
        >
          ×
        </button>
        
        <h3>Checkout</h3>
        
        {error && (
          <div style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          
          <label htmlFor="billingAddress">Billing Address</label>
          <textarea
            id="billingAddress"
            name="billingAddress"
            value={formData.billingAddress}
            onChange={handleInputChange}
            required
            rows="3"
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm; 