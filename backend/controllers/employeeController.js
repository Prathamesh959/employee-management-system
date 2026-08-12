const employeeService = require("../services/employeeService");

const getEmployees = async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();

        res.status(200).json({
            success: true,
            data: employees
        });
    } catch (error) {
        console.error("Error fetching employees:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch employees"
        });
    }
};

const addEmployee = async (req, res) => {
    try {
        const newEmployee = await employeeService.createEmployee(req.body);

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: newEmployee,
        });
    } catch (error) {
        console.error("Error creating employee:", error);

        // Duplicate entry (employee_id or email already exists)
        if (error.statusCode === 409) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create employee",
        });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: `Employee with id ${req.params.id} not found`,
            });
        }

        res.status(200).json({
            success: true,
            data: employee,
        });
    } catch (error) {
        console.error("Error fetching employee:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch employee",
        });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await employeeService.updateEmployee(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: updatedEmployee,
        });
    } catch (error) {
        console.error("Error updating employee:", error);

        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (error.statusCode === 409) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update employee",
        });
    }
};

const removeEmployee = async (req, res) => {
    try {
        const deletedEmployee = await employeeService.deleteEmployee(req.params.id);

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
            data: deletedEmployee,
        });
    } catch (error) {
        console.error("Error deleting employee:", error);

        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to delete employee",
        });
    }
};

module.exports = {
    getEmployees,
    addEmployee,
    getEmployeeById,
    updateEmployee,
    removeEmployee,
};