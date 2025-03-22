import React, { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/list`);
            if (response.data.success) {
                // Remove duplicates using a Set (assuming each order has a unique ID)
                const uniqueOrders = Array.from(new Map(response.data.data.map(order => [order.id, order])).values());
                setOrders(uniqueOrders);
                console.log(uniqueOrders);
            } else {
                toast.error("Error");
            }
        } catch (error) {
            toast.error("Error fetching orders");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, [url]); // Only run when the URL changes

    // ✅ Status Update Handler
    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(url + "/api/order/status", {
                orderId,
                status: event.target.value
            });

            if (response.data.success) {
                await fetchAllOrders();
                toast.success("Order status updated successfully!");
            } else {
                toast.error("Failed to update order status");
            }
        } catch (error) {
            toast.error("Error updating order status");
            console.error(error);
        }
    };

    return (
        <div className='order add'>
            <h3>Order Page</h3>
            <div className="order-list">
                {orders.map((order, index) => (
                    <div key={order.id || index} className='order-item'>
                        <img src={assets.parcel_icon} alt="Parcel Icon" />
                        <div>
                            <p className='order-item-food'>
                                {order.items.map((item, itemIndex) => 
                                    `${item.name} x ${item.quantity}${itemIndex === order.items.length - 1 ? "" : ", "}`
                                )}
                            </p>
                            <p className="order-item-name">{order.address.firstName + " " + order.address.lastName}</p>
                            <div className="order-item-address">
                                <p>{order.address.street}</p>
                                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                                <div>
                                    <p className='order-item-phone'>{order.address.phone}</p>
                                </div>
                                <p>Items : {order.items.length}</p>
                                <p>${order.amount}</p>
                                <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                                    <option value="Food Processing">Food Processing</option>
                                    <option value="Out for delivery">Out for delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;