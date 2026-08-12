const authService = require("../services/authService");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const result = await authService.loginUser(email, password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result.user,
            token: result.token,
        });
    } catch (error) {
        console.error("Login error:", error);

        if (error.statusCode === 401) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

module.exports = {
    login,
};
