const mongoose = require("mongoose");
const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const userRoutes = require("./api/user");
const foodRoutes = require("./api/home");

env.config(); // Load environment variables

const app = express();
const Port = process.env.Port || 3000;
const MONGO_URL = process.env.MONGO_URL;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Debugging Route for MongoDB
app.get("/mongo-test", async (req, res) => {
  try {
    const connection = await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log("MongoDB connected:", connection.connection.host);
    res.status(200).json({ message: "MongoDB connected successfully" });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    res.status(500).json({ error: "Failed to connect to MongoDB", details: err.message });
  }
});

// Main route for testing
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Environment variable check
app.get("/test-env", (req, res) => {
  res.status(200).json({
    JWT_SECRET: process.env.JWT_SECRET ? "Loaded" : "Not Loaded",
    MONGO_URI: process.env.MONGO_URL ? "Loaded" : "Not Loaded",
  });
});

// Application routes
app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);

// Start the server
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
