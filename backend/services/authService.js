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

module.exports = {
    loginUser,
};
