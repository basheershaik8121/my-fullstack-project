import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add Food Item
const addFood = async (req, res) => {
    try {
        // Check if an image is uploaded
        let image_filename = req.file ? `${req.file.filename}` : null;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename
        });

        await food.save();
        res.json({ success: true, message: "✅ Food Added Successfully" });

    } catch (error) {
        console.error("❌ Error Adding Food:", error);
        res.status(500).json({ success: false, message: "❌ Failed to Add Food", error: error.message });
    }
};

// List All Food Items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });

    } catch (error) {
        console.error("❌ Error Fetching Food List:", error);
        res.status(500).json({ success: false, message: "❌ Failed to Fetch Food List", error: error.message });
    }
};

// Remove Food Item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "❌ Food Item Not Found" });
        }

        // Delete image if it exists
        if (food.image) {
            const imagePath = `uploads/${food.image}`;
            fs.unlink(imagePath, (err) => {
                if (err && err.code !== "ENOENT") {
                    console.error("❌ Error Deleting Image:", err);
                }
            });
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "✅ Food Removed Successfully" });

    } catch (error) {
        console.error("❌ Error Removing Food:", error);
        res.status(500).json({ success: false, message: "❌ Failed to Remove Food", error: error.message });
    }
};

export { addFood, listFood, removeFood };
