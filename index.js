const mongoose = require("mongoose");
const express = require("express");
const app = express();
const env = require("dotenv");
env.config();
const cors = require("cors");

const PORT = process.env.PORT || 5000; // Set a default port of 5000
const MONGO_URL = process.env.MONGO_URL;
const userRoutes = require("./api/user");
const foodRoutes = require("./api/home");

// To prevent re-connecting on every request in serverless
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit if DB connection fails
  }
};

// CORS Configuration
app.use(
  cors({
    origin: "*", // Adjust the CORS settings as needed for security
  })
);

app.use(express.json());

// Ensure MongoDB connection before starting the server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);
