// In middleware/auth.js

const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

const isLoggedIn = (req, res, next) => {
    console.log("Authorization Header:", req.headers.authorization);

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.error("No authorization header provided");
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Ensure Bearer format
    console.log("Extracted Token:", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err.message);
            return res.status(401).json({ message: "Invalid token" });
        }
        console.log("Decoded JWT Payload:", decoded);
        req.user = decoded;
        next();
    });
};


module.exports = { isLoggedIn };  