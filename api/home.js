const express = require("express");
const mongoose = require("mongoose");
const User = require("../Schemas/userSchema.js");
const Food = require("../Schemas/foodSchema.js");
const { isLoggedIn } = require("../middleware/auth.js");

const app = express();
app.use(express.json());

// Helper Function for Timeouts
const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout exceeded")), ms));
  return Promise.race([promise, timeout]);
};

// POST: Create a new food menu
app.post("/", isLoggedIn, async (req, res) => {
  const startTime = Date.now();
  try {
    const { title, description, price } = req.body;

    if (!title || !description || typeof price !== "number") {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const user = await withTimeout(User.findOne({ email: req.user.email }).lean(), 5000);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newFood = await new Food({ title, description, price, userId: user._id }).save();
    console.log("POST /: Food menu created successfully", newFood);

    return res.status(200).json({ message: "Food menu created successfully", id: newFood._id });
  } catch (error) {
    console.error("POST / Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    console.log(`POST / Execution Time: ${Date.now() - startTime}ms`);
  }
});

// PUT: Update an existing food menu item
app.put("/:id", isLoggedIn, async (req, res) => {
  const startTime = Date.now();
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid food ID" });
    }

    if (!title || !description || typeof price !== "number") {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const user = await withTimeout(User.findOne({ email: req.user.email }).lean(), 5000);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const food = await withTimeout(Food.findOne({ _id: id, userId: user._id }), 5000);
    if (!food) {
      return res.status(404).json({ message: "Food data not found" });
    }

    food.title = title;
    food.description = description;
    food.price = price;
    await food.save();

    console.log("PUT /: Food menu updated successfully", food);
    return res.status(200).json({ message: "Food menu updated successfully" });
  } catch (error) {
    console.error("PUT / Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    console.log(`PUT / Execution Time: ${Date.now() - startTime}ms`);
  }
});

// GET: Fetch all food menus with optional search
app.get("/", async (req, res) => {
  const startTime = Date.now();
  try {
    const search = req.query.search || "";

    const food = await withTimeout(
      Food.find({ title: { $regex: search, $options: "i" } })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      5000
    );

    console.log("GET /: Food data fetched successfully", food);
    return res.status(200).json(food);
  } catch (error) {
    console.error("GET / Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    console.log(`GET / Execution Time: ${Date.now() - startTime}ms`);
  }
});

// GET: Fetch food menu by ID
app.get("/:id", async (req, res) => {
  const startTime = Date.now();
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid food ID" });
    }

    const food = await withTimeout(Food.findById(id).lean(), 5000);
    if (!food) {
      return res.status(404).json({ message: "Food data not found" });
    }

    console.log("GET /:id Food data fetched successfully", food);
    return res.status(200).json(food);
  } catch (error) {
    console.error("GET /:id Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    console.log(`GET /:id Execution Time: ${Date.now() - startTime}ms`);
  }
});

module.exports = app;
