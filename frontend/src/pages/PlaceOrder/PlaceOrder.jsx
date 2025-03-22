import React, { useState, useContext, useEffect } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const { getTotalCartAmount, token: contextToken, food_list, cartItems, url } = useContext(StoreContext);
    const navigate = useNavigate();

    // Retrieve token from localStorage if not in context
    const token = contextToken || localStorage.getItem("token");

    useEffect(() => {
        console.log("Checking authentication and cart amount...");
        console.log("Token:", token);
        console.log("Cart Amount:", getTotalCartAmount());

        if (!token || getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token, navigate, getTotalCartAmount()]); 

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const placeOrder = async (event) => {
        event.preventDefault();
        
        if (!token) {
            alert("Authentication failed! Please log in again.");
            return;
        }

        let orderItems = [];
        food_list.forEach((item) => {  
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item, quantity: cartItems[item._id] };
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 2,
        };

        try {
            console.log("Sending request with token:", token); 

            let response = await axios.post(url + "/api/order/place", orderData, { 
                headers: { 
                    Authorization: `Bearer ${token}`,  
                    "Content-Type": "application/json"
                },
                withCredentials: true 
            });

            console.log("Server response:", response.data);

            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            } else {
                alert("Error placing order: " + response.data.message);
            }
        } catch (error) {
            console.error("Order placement failed:", error.response ? error.response.data : error);
            alert("Order failed! " + (error.response?.data?.message || "Please try again."));
        }
    };

    return (
        <form className="place-order" onSubmit={placeOrder}>
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="multi-fields">
                    <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name" />
                    <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last name" />
                </div>
                <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
                <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
                <div className="multi-fields">
                    <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
                    <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
                </div>
                <div className="multi-fields">
                    <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zipcode" />
                    <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
                </div>
                <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
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
                            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                        </div>
                    </div>
                    <button type="submit">PROCEED TO PAYMENT</button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
