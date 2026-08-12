const { pool } = require("../config/db");

const getAllDepartments = async () => {
    const [rows] = await pool.query(
        `SELECT id, name FROM departments ORDER BY name`
    );

    return rows;
};

module.exports = {
    getAllDepartments,
};
