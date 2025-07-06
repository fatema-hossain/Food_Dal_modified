import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <h1>Thank you for your order!</h1>
      <p>Your order has been placed successfully and is being processed.</p>
      <button 
        onClick={() => navigate('/')}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;
