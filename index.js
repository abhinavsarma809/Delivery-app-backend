const mongoose = require("mongoose");
const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");

env.config();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const userRoutes = require('./api/user');
const foodRoutes = require('./api/home');

// Apply middleware
app.use(cors({
    origin: "*"
}));

// Use express JSON middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => {
    res.send("Hello World");
});


app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);


mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
