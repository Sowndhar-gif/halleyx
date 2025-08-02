import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import CustomerAuth from './CustomerAuth';
import CustomerDashboard from './CustomerDashboard';
import CheckoutForm from './CheckoutForm';

const CustomerPortal = () => {
  const { currentCustomer, customerToken, isImpersonating } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div>
      <h1>Customer Portal</h1>
      
      {!currentCustomer ? (
        <CustomerAuth />
      ) : (
        <>
          <CustomerDashboard 
            onCheckout={() => setShowCheckout(true)}
          />
          {showCheckout && (
            <CheckoutForm 
              onClose={() => setShowCheckout(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CustomerPortal; 