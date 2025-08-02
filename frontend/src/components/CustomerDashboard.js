import React from 'react'; // Removed useState and useEffect
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProductList from './ProductList';
import OrderList from './OrderList';
import CustomerProfile from './CustomerProfile';
import CustomerSupport from './CustomerSupport';

const CustomerDashboard = ({ onCheckout }) => {
  const { currentCustomer, logoutCustomer } = useAuth();
  const { getCartItemCount } = useCart();

  return (
    <div>
      <h2>Welcome, {currentCustomer?.firstName || currentCustomer?.email?.split('@')[0]}!</h2>

      <button onClick={logoutCustomer} style={{ marginBottom: '1rem' }}>
        Logout
      </button>

      {/* Cart Summary */}
      <div style={{
        background: 'var(--input-bg)',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        border: '2px solid var(--primary)'
      }}>
        <h3>Your Cart ({getCartItemCount()} items)</h3>
        <button onClick={onCheckout} disabled={getCartItemCount() === 0}>
          Proceed to Checkout
        </button>
      </div>

      {/* Products Section */}
      <h3>Browse Products</h3>
      <ProductList />

      {/* Orders Section */}
      <h3>Your Orders</h3>
      <OrderList />

      {/* Profile Section */}
      <h3>Profile</h3>
      <CustomerProfile />

      {/* Customer Support Section */}
      <CustomerSupport />
    </div>
  );
};

export default CustomerDashboard;
