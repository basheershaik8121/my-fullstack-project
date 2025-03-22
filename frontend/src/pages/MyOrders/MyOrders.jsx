import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import parcelIcon from '../../assets/parcel_icon.png'; // Adjust path based on your project structure
import './MyOrders.css';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        if (!token) return;
        try {
            const response = await axios.get(url + "/api/order/userorders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Raw API Response:", response.data.data); // Log the raw response for debugging

            // First, try deduplicating by _id (or id, depending on your API)
            const uniqueOrdersById = Array.from(
                new Map(response.data.data.map(order => [order._id, order])).values()
            );

            // If deduplication by _id doesn't work (e.g., different IDs but same content),
            // deduplicate by content (items, amount, status)
            const uniqueOrders = Array.from(
                new Map(
                    uniqueOrdersById.map(order => {
                        // Create a unique key based on items, amount, and status
                        const itemsKey = order.items
                            .map(item => `${item.name} x ${item.quantity}`)
                            .sort()
                            .join(';');
                        const orderKey = `${itemsKey}|${order.amount}|${order.status}`;
                        return [orderKey, order];
                    })
                ).values()
            );

            setOrders(uniqueOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <div className="container">
                {orders.map((order) => (
                    <div key={order._id} className="my-orders-order">
                        <img src={parcelIcon} alt="Order Icon" />
                        <p>
                            {order.items.map((item, itemIndex) => (
                                <span key={itemIndex}>
                                    {item.name} x {item.quantity}
                                    {itemIndex < order.items.length - 1 ? "; " : ""}
                                </span>
                            ))}
                        </p>
                        <p>${order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p>
                            <span className="order-status">
                                <b>{order.status}</b>
                            </span>
                        </p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;