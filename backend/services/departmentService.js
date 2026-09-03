const { pool } = require("../config/db");

const getAllDepartments = async () => {
    const query = `
        SELECT 
            d.id, 
            d.name,
            COUNT(e.id) AS totalEmployees,
            COALESCE(SUM(CASE WHEN e.status = 'Active' THEN 1 ELSE 0 END), 0) AS activeEmployees
        FROM departments d
        LEFT JOIN employees e ON d.id = e.department_id
        GROUP BY d.id, d.name
        ORDER BY d.name
    `;
    const [rows] = await pool.query(query);
    return rows;
};

const getDepartmentById = async (id) => {
    const query = `
        SELECT 
            d.id, 
            d.name,
            COUNT(e.id) AS totalEmployees,
            COALESCE(SUM(CASE WHEN e.status = 'Active' THEN 1 ELSE 0 END), 0) AS activeEmployees
        FROM departments d
        LEFT JOIN employees e ON d.id = e.department_id
        WHERE d.id = ?
        GROUP BY d.id, d.name
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
};

const createDepartment = async (name) => {
    const query = `INSERT INTO departments (name) VALUES (?)`;
    const [result] = await pool.query(query, [name]);
    return result.insertId;
};

const updateDepartment = async (id, name) => {
    const query = `UPDATE departments SET name = ? WHERE id = ?`;
    await pool.query(query, [name, id]);
};

const deleteDepartment = async (id) => {
    // Check for existing employees
    const checkQuery = `SELECT COUNT(*) as count FROM employees WHERE department_id = ?`;
    const [checkRows] = await pool.query(checkQuery, [id]);
    
    if (checkRows[0].count > 0) {
        const error = new Error("Cannot delete department because employees are still assigned to it.");
        error.code = 'EMPLOYEES_ASSIGNED';
        throw error;
    }

    const deleteQuery = `DELETE FROM departments WHERE id = ?`;
    await pool.query(deleteQuery, [id]);
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
