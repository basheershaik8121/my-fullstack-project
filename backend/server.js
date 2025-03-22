import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import 'dotenv/config';

// ✅ Initialize Express App
const app = express();
const port = process.env.PORT || 4000;

// ✅ Allow CORS for Multiple Origins (Including localhost:3000)
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    process.env.FRONTEND_URL  // ✅ Environment variable for production
];

// ✅ CORS Debugging - Logs every request origin
const corsOptions = {
    origin: (origin, callback) => {
        console.log("🔍 Incoming Request Origin:", origin);

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`🚫 Blocked by CORS: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true,
    optionsSuccessStatus: 204
};

// ✅ Apply Middleware in Correct Order
app.use(express.json()); // ✅ Parse JSON before routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Preflight requests

// ✅ Debugging Middleware - Logs every request
app.use((req, res, next) => {
    console.log(`📢 ${req.method} Request to ${req.url}`);
    console.log("🔹 Headers:", req.headers);
    console.log("🔹 Body:", req.body);
    next();
});

// ✅ Connect to Database
connectDB();

// ✅ API Routes
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));  // ✅ Serving static files
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ Default Route (Health Check)
app.get("/", (req, res) => {
    res.json({ message: "API Working ✅" });
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`🚀 Server Running on: http://localhost:${port}`);
});
