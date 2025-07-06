// backend/routes/sslcommerz.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'querystring';
import orderModel from '../models/orderModel.js';

dotenv.config();
const router = express.Router();

// ✅ INITIATE PAYMENT + SAVE ORDER
router.post('/initiate', async (req, res) => {
  const { userId, total_amount, cus_email, cus_name, cus_phone, address, items } = req.body;

  if (!userId || !total_amount || !cus_email || !cus_name || !cus_phone || !address || !items) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transactionId = 'tran_' + Date.now();

  // ✅ Save Order to DB
  try {
    await orderModel.create({
      userId,
      items,
      amount: total_amount,
      address,
      payment: false,
      status: 'Food Processing',
      date: Date.now(),
      tran_id: transactionId, // ✅ Required field
    });
  } catch (err) {
    console.error('❌ Order save failed:', err);
    return res.status(500).json({ error: 'Failed to save order to database' });
  }

  // ✅ Prepare SSLCommerz Payload
  const sslData = {
    store_id: process.env.STORE_ID,
    store_passwd: process.env.STORE_PASSWORD,
    total_amount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `http://localhost:4000/api/sslcommerz/success`,
    fail_url: `http://localhost:4000/api/sslcommerz/fail`,
    cancel_url: `http://localhost:4000/api/sslcommerz/cancel`,
    cus_name,
    cus_email,
    cus_phone,
    shipping_method: 'NO',
    product_name: 'Food Order',
    product_category: 'Food',
    product_profile: 'general',
  };

  try {
    const response = await axios.post(
      'https://sandbox.sslcommerz.com/gwprocess/v3/api.php',
      qs.stringify(sslData),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.data?.GatewayPageURL) {
      res.json({ url: response.data.GatewayPageURL });
    } else {
      res.status(400).json({ error: 'Failed to get gateway URL', details: response.data });
    }
  } catch (error) {
    console.error('❌ SSLCommerz API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'SSLCommerz Error', details: error.message });
  }
});

// ✅ SUCCESS Handler — Update payment: true
router.post('/success', async (req, res) => {
  console.log('✅ Payment Success Payload:', req.body);

  const tran_id = req.body?.tran_id;

  if (!tran_id) {
    console.error('❌ Missing tran_id in success response');
    return res.redirect('http://localhost:5173/order/success');
  }

  try {
    const order = await orderModel.findOneAndUpdate(
      { tran_id },
      { $set: { payment: true } }
    );

    if (!order) {
      console.warn('⚠️ No matching order found to update payment.');
    } else {
      console.log('✅ Payment updated for tran_id:', tran_id);
    }

    res.redirect('http://localhost:5173/order/success');
  } catch (err) {
    console.error('❌ Failed to update payment:', err);
    res.redirect('http://localhost:5173/order/success');
  }
});



// ❌ FAIL Handler
router.post('/fail', (req, res) => {
  console.log('❌ Payment Failed:', req.body);
  res.redirect('http://localhost:5173/order/fail');
});

// ⚠️ CANCEL Handler
router.post('/cancel', (req, res) => {
  console.log('⚠️ Payment Cancelled:', req.body);
  res.redirect('http://localhost:5173/order/cancel');
});

export default router;
