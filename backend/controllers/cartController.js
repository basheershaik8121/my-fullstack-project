import userModel from "../models/userModel.js";

// ✅ Add item to cart
const addToCart = async (req, res) => {
    try {  
        const userId = req.user.id; // ✅ Get userId from authMiddleware
        let userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};  // Ensure cartData is initialized

        cartData[req.body.itemId] = (cartData[req.body.itemId] || 0) + 1;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.status(200).json({ success: true, message: "Added to Cart" });

    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Get userId from authMiddleware
        let userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        if (!cartData[req.body.itemId]) {
            return res.status(400).json({ success: false, message: "Item not in cart" });
        }

        cartData[req.body.itemId] -= 1;
        if (cartData[req.body.itemId] === 0) delete cartData[req.body.itemId];

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.status(200).json({ success: true, message: "Removed from Cart" });

    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Get user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Get userId from authMiddleware
        let userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, cartData: userData.cartData || {} });

    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { addToCart, removeFromCart, getCart };
