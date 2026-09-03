const { pool } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (email, password) => {
    // Find user by email
    const [rows] = await pool.query(
        `SELECT id, name, email, password, role FROM users WHERE email = ?`,
        [email]
    );

    if (rows.length === 0) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const user = rows[0];

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // Return user data (without password) and token
    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    return { user: userData, token };
};

const getUserProfile = async (userId) => {
    const [rows] = await pool.query(
        `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
        [userId]
    );

    if (rows.length === 0) {
        throw new Error("User not found");
    }

    return rows[0];
};

const updateUserProfile = async (userId, name) => {
    await pool.query(
        `UPDATE users SET name = ? WHERE id = ?`,
        [name, userId]
    );
};

const changePassword = async (userId, currentPassword, newPassword) => {
    // 1. Fetch current hashed password from DB
    const [rows] = await pool.query(
        `SELECT password FROM users WHERE id = ?`,
        [userId]
    );

    if (rows.length === 0) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const user = rows[0];

    // 2. Verify current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        const error = new Error("Incorrect current password");
        error.statusCode = 401;
        throw error;
    }

    // 3. Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update the DB
    await pool.query(
        `UPDATE users SET password = ? WHERE id = ?`,
        [hashedNewPassword, userId]
    );
};

module.exports = {
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword
};
