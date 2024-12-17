const express = require("express");
const mongoose = require("mongoose");
const User = require("../Schemas/userSchema.js");
const Food = require("../Schemas/foodSchema.js");
const { isLoggedIn } = require("../middleware/auth.js");

const app = express();


app.use(express.json());

app.post("/", isLoggedIn, async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const user = await User.findOne({ email: req.user.email });
    const newFood = await new Food({ title, description, price, userId: user._id }).save();
    return res.status(200).json({ message: "Food menu created successfully", id: newFood._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const user = await User.findOne({ email: req.user.email });
    const food = await Food.findOne({ _id: req.params.id, userId: user._id });
    if (!food) {
      return res.status(400).json({ message: "Food data not found" });
    }
    food.title = title;
    food.description = description;
    food.price = price;
    await food.save();
    return res.status(200).json({ message: "Food data edited" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/", async (req, res) => {
  console.log("Request received: GET /api/food");
  try {
    console.log("Query Params:", req.query);
    const food = await Food.find({ title: { $regex: req.query.search || "", $options: "i" } })
    .sort({ createdAt: -1 })
    .limit(20) 
    .lean();
  
    console.log("Food Data:", food);
    res.status(200).json(food);
  } catch (error) {
    console.error("GET / Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid food ID" });
    }

    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food data not found" });
    }

    return res.status(200).json(food);
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = app;
