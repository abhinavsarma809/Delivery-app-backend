
const express = require('express');
const User = require('../Schemas/userSchema.js'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Initialize dotenv for environment variables
dotenv.config();

const app = express();
app.use(express.json());

// POST Signup Route
app.post("/signup", async (req, res) => {
    try {
        const { email, name, password, gender, country } = req.body;
        const UserExist = await User.findOne({ email });
        if (UserExist) {
            return res.status(400).json({ message: "User exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, name, password: hashedPassword, gender, country });
        await newUser.save();
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        return res.status(200).json({
            message: "User created successfully",
            id: newUser._id,
            token,
            name: newUser.name,
            email: newUser.email,
            gender: newUser.gender,
            country: newUser.country
        });
    } catch (err) {
        console.log("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST Signin Route
app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        return res.status(200).json({
            message: "Login successful",
            id: user._id,
            token,
            name: user.name,
            email: user.email,
            gender: user.gender,
            country: user.country
        });
    } catch (err) {
        console.log("Signin error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT Update User Route
app.put("/:id", async (req, res) => {
    try {
        const { email, name, country, gender } = req.body;
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        user.email = email;
        user.name = name;
        user.gender = gender;
        user.country = country;
        await user.save();
        return res.status(200).json({
            message: "User data updated successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                gender: user.gender,
                country: user.country,
            },
        });
    } catch (error) {
        console.log("Update error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Export the Express app as a handler for Vercel
module.exports = app;
