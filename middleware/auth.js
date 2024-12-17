const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

// Middleware to validate JWT and attach user to the request
const isLoggedIn = (req, res, next) => {
  try {
    // Log incoming authorization header for debugging
    console.log("[Auth] Authorization Header:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    // Check for missing Authorization header
    if (!authHeader) {
      console.warn("[Auth] No authorization header provided");
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract Bearer token
    const token = authHeader.split(" ")[1];
    if (!token) {
      console.warn("[Auth] Malformed authorization header");
      return res.status(401).json({ message: "Malformed token" });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("[Auth] Token verification failed:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Attach decoded user info to the request object
      console.log("[Auth] Token decoded successfully:", decoded);
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("[Auth] Unexpected error:", error.message);
    res.status(500).json({ message: "Server error during authentication" });
  }
};

module.exports = { isLoggedIn };
