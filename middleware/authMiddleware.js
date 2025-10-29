const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // Check if token is provided in Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, msg: "Authorization token missing or malformed" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    // Attach user data to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ success: false, msg: "Invalid or expired token" });
  }
};

module.exports = { protect };


