import express from "express";
import cors from "cors";  // ✅ Import CORS
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

// ✅ Apply CORS middleware to this router
orderRouter.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],  // ✅ Multiple origins allowed
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true
}));

// ✅ Routes
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.get("/userorders", authMiddleware, userOrders);
orderRouter.get('/list', listOrders);
orderRouter.post("/status", updateStatus);

export default orderRouter;
