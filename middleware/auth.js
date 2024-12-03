// In middleware/auth.js

const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

const isLoggedIn = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
               res.status(401).json({ message: "Invalid Token" });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({ message: "No token provided" });
    }
};

module.exports = { isLoggedIn };  