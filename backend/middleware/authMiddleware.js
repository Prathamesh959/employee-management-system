const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Read the Authorization header
    const authHeader = req.headers.authorization;

    // Check if the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
    }

    // Extract the token (everything after "Bearer ")
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token using the secret from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user info to the request object
        req.user = decoded;

        // Token is valid — proceed to the next middleware or controller
        next();
    } catch (error) {
        // Token is invalid or expired
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again.",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }
};

module.exports = authMiddleware;
