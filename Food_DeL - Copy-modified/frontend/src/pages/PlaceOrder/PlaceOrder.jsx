import React, { useState, useEffect, useContext } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PlaceOrder = () => {
  const { getTotalCartAmount, cartItems, food_list, token, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSslCommerzPayment = async (e) => {
    e.preventDefault();

    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
    const amount = getTotalCartAmount() + 2;

    if (!fullName || !data.email || !data.phone || !data.address || amount <= 0) {
      alert('Please fill in all required fields.');
      return;
    }

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({ ...item, quantity: cartItems[item._id] }));

    let userId = '';
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      alert('Invalid token. Please log in again.');
      return;
    }

    const orderPayload = {
      userId,
      items: orderItems,
      amount,
      address: {
        fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
      },
      payment: false,
    };

    try {
      
      console.log('🛒 Sending payment payload:', {
        userId,
        total_amount: amount,
        cus_email: data.email.trim(),
        cus_name: fullName,
        cus_phone: data.phone.trim(),
        address: data.address.trim(),
        items: orderItems,
      });

      // ✅ 2. Initiate SSLCommerz payment
      const paymentRes = await axios.post(`${url}/api/sslcommerz/initiate`, {
        userId,
        total_amount: amount,
        cus_email: data.email.trim(),
        cus_name: fullName,
        cus_phone: data.phone.trim(),
        address: data.address.trim(),
        items: orderItems,
      });

      if (paymentRes.data && paymentRes.data.url) {
        window.location.href = paymentRes.data.url;
      } else {
        alert('Failed to initiate payment.');
        console.error(paymentRes.data);
      }
    } catch (err) {
      console.error('❌ Error:', err.response?.data || err.message);
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <form className="place-order" onSubmit={handleSslCommerzPayment}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder="First Name" />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} placeholder="Last Name" />
        </div>
        <input required name="address" onChange={onChangeHandler} value={data.address} placeholder="Full Address" />
        <input required name="email" type="email" onChange={onChangeHandler} value={data.email} placeholder="Email Address" />
        <input required name="phone" onChange={onChangeHandler} value={data.phone} placeholder="Phone Number" />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit" disabled={getTotalCartAmount() === 0}>
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
