const mongoose = require("mongoose");
const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");
const userRoutes = require('./api/user');
const foodRoutes = require('./api/home');

env.config();

const MONGO_URL = process.env.MONGO_URL;

// Middleware setup
app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);

// MongoDB connection
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Vercel needs the handler to be exported for serverless functions
module.exports = (req, res) => {
    app(req, res); // Pass the request and response to the app
};
