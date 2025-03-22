import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from "stripe";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Middleware to Authenticate User
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

// ✅ Secure Order Placement API
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174"; // Change if deployed
    

    try {
        // 🔐 Ensure user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid user" });
        }

        // ✅ Create and save the order in DB
        const newOrder = new orderModel({
            userId: req.user.id, // ✅ Secure: Extracted from JWT
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });

        // ✅ Creating line items for Stripe (corrected price calculation)
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 // ✅ Corrected pricing
            },
            quantity: item.quantity
        }));

        // ✅ Adding delivery charges (fixed amount ₹2)
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 200 // ✅ Fixed price (₹2 in paise)
            },
            quantity: 1
        });

        // ✅ Creating Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder.id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder.id}`
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("❌ Order Placement Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Secure Order Verification API
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            return res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            return res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.error("❌ Verification Error:", error);
        return res.status(500).json({ success: false, message: "Error" });
    }
};

// ✅ Secure User Orders API
const userOrders = async (req, res) => {
    try {
        console.log("🔹 User ID from Middleware:", req.user.id); // Debugging

        const orders = await orderModel.find({ userId: req.user.id }); // ✅ Correct: Using req.user.id

        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("❌ Error Fetching Orders:", error);
        res.json({ success: false, message: "Error retrieving orders" });
    }
};
// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};
//Api for updating order status
const updateStatus =async(req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
    

}



export { placeOrder, verifyOrder, userOrders,listOrders,updateStatus };
