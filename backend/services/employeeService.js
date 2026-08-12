const { pool } = require("../config/db");

const getAllEmployees = async () => {
    const [rows] = await pool.query(`
        SELECT
            e.id,
            e.employee_id,
            e.first_name,
            e.last_name,
            e.email,
            e.phone,
            e.designation,
            e.joining_date,
            e.salary,
            e.status,
            d.name AS department
        FROM employees e
        LEFT JOIN departments d
            ON e.department_id = d.id
        ORDER BY e.id DESC
    `);

    return rows;
};

const createEmployee = async (employeeData) => {
    const {
        employee_id,
        first_name,
        last_name,
        email,
        phone,
        department_id,
        designation,
        joining_date,
        salary,
        status,
    } = employeeData;

    try {
        const [result] = await pool.query(
            `INSERT INTO employees
                (employee_id, first_name, last_name, email, phone,
                 department_id, designation, joining_date, salary, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                employee_id,
                first_name,
                last_name,
                email,
                phone || null,
                department_id || null,
                designation || null,
                joining_date || null,
                salary || null,
                status || "Active",
            ]
        );

        return { id: result.insertId, employee_id };
    } catch (error) {
        // Handle duplicate entry errors gracefully
        if (error.code === "ER_DUP_ENTRY") {
            const duplicateError = new Error(
                error.message.includes("employee_id")
                    ? `Employee ID '${employee_id}' already exists`
                    : `Email '${email}' already exists`
            );
            duplicateError.statusCode = 409;
            throw duplicateError;
        }
        throw error;
    }
};

const getEmployeeById = async (id) => {
    const [rows] = await pool.query(
        `SELECT
            e.id,
            e.employee_id,
            e.first_name,
            e.last_name,
            e.email,
            e.phone,
            e.designation,
            e.joining_date,
            e.salary,
            e.status,
            d.name AS department
        FROM employees e
        LEFT JOIN departments d
            ON e.department_id = d.id
        WHERE e.id = ?`,
        [id]
    );

    return rows[0] || null;
};

const updateEmployee = async (id, employeeData) => {
    const {
        employee_id,
        first_name,
        last_name,
        email,
        phone,
        department_id,
        designation,
        joining_date,
        salary,
        status,
    } = employeeData;

    // Check if the employee exists first
    const existing = await getEmployeeById(id);
    if (!existing) {
        const notFoundError = new Error(`Employee with id ${id} not found`);
        notFoundError.statusCode = 404;
        throw notFoundError;
    }

    try {
        await pool.query(
            `UPDATE employees
             SET employee_id = ?, first_name = ?, last_name = ?, email = ?,
                 phone = ?, department_id = ?, designation = ?,
                 joining_date = ?, salary = ?, status = ?
             WHERE id = ?`,
            [
                employee_id,
                first_name,
                last_name,
                email,
                phone || null,
                department_id || null,
                designation || null,
                joining_date || null,
                salary || null,
                status || "Active",
                id,
            ]
        );

        // Return the updated employee with department name
        return await getEmployeeById(id);
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            const duplicateError = new Error(
                error.message.includes("employee_id")
                    ? `Employee ID '${employee_id}' already exists`
                    : `Email '${email}' already exists`
            );
            duplicateError.statusCode = 409;
            throw duplicateError;
        }
        throw error;
    }
};

const deleteEmployee = async (id) => {
    const existing = await getEmployeeById(id);
    if (!existing) {
        const notFoundError = new Error(`Employee with id ${id} not found`);
        notFoundError.statusCode = 404;
        throw notFoundError;
    }

    await pool.query(`DELETE FROM employees WHERE id = ?`, [id]);

    return existing;
};

module.exports = {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
};