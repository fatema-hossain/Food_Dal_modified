/*import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Get the frontend URL from environment variables
const frontend_url = "http://localhost:5174";

// Place a new order
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Convert INR to paise
            },
            quantity: item.quantity,
        }));

        // Adding delivery charges
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 2 * 100, // Delivery charge in paise
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error('Error placing order:', error.message);
        res.status(500).json({ success: false, message: "Failed to place order" });
    }
};

// Verify the order after payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment successful" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed" });
        }
    } catch (error) {
        console.error('Error verifying order:', error.message);
        res.status(500).json({ success: false, message: "Failed to verify order" });
    }
};

// Retrieve user orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching user orders:', error.message);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};

// List all orders for admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error listing orders:', error.message);
        res.status(500).json({ success: false, message: "Failed to list orders" });
    }
};

// Update the status of an order
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.error('Error updating order status:', error.message);
        res.status(500).json({ success: false, message: "Failed to update order status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus }; 

/*import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Get the frontend URL from environment variables
const frontend_url = process.env.FRONTEND_URL;

// Place a new order
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.userId,    // <-- use req.userId here as well for consistency
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Convert INR to paise
            },
            quantity: item.quantity,
        }));

        // Adding delivery charges
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 2 * 100, // Delivery charge in paise
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error('Error placing order:', error.message);
        res.status(500).json({ success: false, message: "Failed to place order" });
    }
};

// Verify the order after payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment successful" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed" });
        }
    } catch (error) {
        console.error('Error verifying order:', error.message);
        res.status(500).json({ success: false, message: "Failed to verify order" });
    }
};

// Retrieve user orders
const userOrders = async (req, res) => {
    try {
        const userId = req.userId; // <-- Use req.userId here instead of req.body.userId
        const orders = await orderModel.find({ userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching user orders:', error.message);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};

// List all orders for admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error listing orders:', error.message);
        res.status(500).json({ success: false, message: "Failed to list orders" });
    }
};

// Update the status of an order
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.error('Error updating order status:', error.message);
        res.status(500).json({ success: false, message: "Failed to update order status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };*/
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Place a new order without Stripe
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,      // or req.userId if you use auth middleware
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: true,               // mark payment done or false as per your logic
      status: "Pending",           // optional order status
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Return simple success response with order ID
    res.json({ success: true, orderId: newOrder._id });
  } catch (error) {
    console.error('Error placing order:', error.message);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
};

// Verify order — with Stripe removed, you may not need this anymore,
// but if you want to keep it for manual verification or status update, keep it simple:
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error('Error verifying order:', error.message);
    res.status(500).json({ success: false, message: "Failed to verify order" });
  }
};

// Retrieve user orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching user orders:', error.message);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// List all orders for admin
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error listing orders:', error.message);
    res.status(500).json({ success: false, message: "Failed to list orders" });
  }
};

// Update order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
