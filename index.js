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


mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, 
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process if the connection fails
  });


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/test-env", (req, res) => {
  res.status(200).json({
    JWT_SECRET: process.env.JWT_SECRET ? "Loaded" : "Not Loaded",
    MONGO_URI: process.env.MONGO_URL ? "Loaded" : "Not Loaded",
  });
});


app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);

// Start the server
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
