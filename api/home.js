// Use 'require' for compatibility with Node.js
const express = require('express');
const router = express.Router();
const User = require('../Schemas/userSchema.js');  // Adjust path if needed
const Food = require('../Schemas/foodSchema.js');  // Adjust path if needed
const { isLoggedIn } = require("../middleware/auth.js");  // Adjust path if needed

// POST - Create a new food item (Requires Authentication)
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { title, description, price } = req.body;
        
        // Get the user from the request object (assuming JWT-based login)
        const user = await User.findOne({ email: req.user.email });
        
        // Create a new food item and save it to the database
        const newFood = new Food({ title, description, price, userId: user._id });
        await newFood.save();
        
        return res.status(200).json({ message: "Food menu created successfully", id: newFood._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST - Edit an existing food item (Requires Authentication)
router.post('/:id', isLoggedIn, async (req, res) => {
    try {
        const { title, description, price } = req.body;
        
        // Find the user from the request object
        const user = await User.findOne({ email: req.user.email });
        
        // Find the food item that the user owns
        const food = await Food.findOne({ _id: req.params.id, userId: user._id });
        
        if (!food) {
            return res.status(400).json({ message: "Food data not found" });
        }
        
        // Update the food item's details
        food.title = title;
        food.description = description;
        food.price = price;
        await food.save();
        
        return res.status(200).json({ message: "Food data edited successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET - Fetch all food items based on search query (supports pagination)
router.get("/", async (req, res) => {
    try {
        const query = req.query.search || "";
        const offset = parseInt(req.query.offset) || 0;  // Default offset to 0
        const limit = parseInt(req.query.limit) || 2;  // Default limit to 2
        
        const food = await Food.find({ title: { $regex: query, $options: "i" } })
                               .sort({ createdAt: -1 })  // Sorting by creation date (newest first)
                               .skip(offset)
                               .limit(limit);
        
        return res.status(200).json(food);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET - Fetch a specific food item by ID
router.get("/:id", async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);  // Corrected to use findById
        if (!food) {
            return res.status(400).json({ message: "Food data not found" });
        }
        
        return res.status(200).json(food);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
