import React, { useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext'; // Ensure correct import
import './Verify.css';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const response = await axios.post(`${url}/api/order/verify`, { success, orderId });

                if (response.data.success) {
                    navigate("/myorders");
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Payment verification failed:", error);
                navigate("/"); // Redirect to home on error
            }
        };

        verifyPayment();
    }, [url, success, orderId, navigate]); // Include dependencies

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;
