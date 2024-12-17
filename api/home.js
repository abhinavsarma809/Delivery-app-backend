const express = require("express");
const mongoose = require("mongoose");
const User = require("../Schemas/userSchema.js");
const Food = require("../Schemas/foodSchema.js");
const { isLoggedIn } = require("../middleware/auth.js");

const app = express();

app.use(express.json());

// Create Food Menu Item
app.post("/", isLoggedIn, async (req, res) => {
  try {
    const { title, description, price } = req.body;

    // Log incoming data
    console.log(`[POST] Creating food item: ${JSON.stringify(req.body)}`);

    const user = await User.findOne({ email: req.user.email }).lean(); // Use lean for performance
    if (!user) return res.status(404).json({ message: "User not found" });

    const newFood = new Food({ title, description, price, userId: user._id });
    await newFood.save();

    return res.status(200).json({
      message: "Food menu created successfully",
      id: newFood._id,
    });
  } catch (error) {
    console.error(`[POST] Error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Edit Food Menu Item
app.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const { title, description, price } = req.body;

    // Log request
    console.log(`[PUT] Updating food item: ${req.params.id}`);

    const user = await User.findOne({ email: req.user.email }).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const food = await Food.findOne({ _id: req.params.id, userId: user._id });
    if (!food) return res.status(400).json({ message: "Food data not found" });

    // Update fields
    food.title = title || food.title;
    food.description = description || food.description;
    food.price = price || food.price;

    await food.save();

    return res.status(200).json({ message: "Food data edited" });
  } catch (error) {
    console.error(`[PUT] Error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get All Food Menu Items
app.get("/", async (req, res) => {
  console.log("[GET] Request to fetch all food items");
  try {
    const searchQuery = req.query.search || "";

    // Log query for debugging
    console.log(`[GET] Search Query: ${searchQuery}`);

    const food = await Food.find({
      title: { $regex: searchQuery, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .limit(20) // Limit results for performance
      .lean();

    res.status(200).json(food);
  } catch (error) {
    console.error(`[GET] Error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get Food Item by ID
app.get("/:id", async (req, res) => {
  console.log(`[GET] Fetching food item with ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid food ID" });
    }

    const food = await Food.findById(id).lean();
    if (!food) return res.status(404).json({ message: "Food data not found" });

    res.status(200).json(food);
  } catch (error) {
    console.error(`[GET/:id] Error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = app;
