const mongoose = require("mongoose");
const express = require("express");
const env = require("dotenv");
const cors = require("cors");

env.config();

const app = express();
const MONGO_URL = process.env.MONGO_URL;

const userRoutes = require('./api/user');
const foodRoutes = require('./api/home');

app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);

// MongoDB connection function
async function connectToDatabase() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw new Error("Database connection failed");
    }
}

// Export handler for Vercel
module.exports = async (req, res) => {
    try {
        // Connect to MongoDB on each request
        await connectToDatabase();
        
        // Handle the request with the Express app
        app(req, res);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
