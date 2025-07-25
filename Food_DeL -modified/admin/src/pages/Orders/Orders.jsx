// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network or server error");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={order._id} className="order-item">
            <img src={assets.parcel_icon} alt="parcel" />
            <div>
              <p className="order-item-food">
                {order.items
                  .map((item) => `${item.name} x${item.quantity}`)
                  .join(", ")}
              </p>
              <p className="order-item-name">User ID: {order.userId}</p>
              <div className="order-item-address">
                <p>{order.address}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>${parseFloat(order.amount).toFixed(2)}</p>

              <label htmlFor={`status-${order._id}`} className="visually-hidden">
                Order Status
              </label>
              <select
                id={`status-${order._id}`}
                name="orderStatus"
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Food Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
