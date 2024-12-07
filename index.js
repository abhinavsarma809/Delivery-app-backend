const mongoose = require("mongoose");
const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");

env.config();

const MONGO_URL = process.env.MONGO_URL;
const userRoutes = require('./api/user');
const foodRoutes = require('./api/home');

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);

// Export the app for Vercel
module.exports = app;
