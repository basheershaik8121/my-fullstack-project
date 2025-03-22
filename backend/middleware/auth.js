import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized: Please log in again" });
        }

        const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"
        
        // Verify the token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("🔹 Decoded Token:", decoded); // Debugging: Check what’s inside the token

        if (!decoded || !decoded.id) {
            return res.status(403).json({ success: false, message: "Invalid token structure" });
        }

        req.user = { id: decoded.id }; // Attach user ID to req.user instead of req.body

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("❌ Auth Error:", error.message);
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authMiddleware;
