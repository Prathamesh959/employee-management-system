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

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await authService.getUserProfile(userId);
        
        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load profile"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;
        
        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        await authService.updateUserProfile(userId, name.trim());
        const updatedProfile = await authService.getUserProfile(userId);
        
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedProfile
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long"
            });
        }

        await authService.changePassword(userId, currentPassword, newPassword);

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Change password error:", error);
        
        if (error.statusCode === 401) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to change password"
        });
    }
};

module.exports = {
    login,
    getProfile,
    updateProfile,
    changePassword
};
