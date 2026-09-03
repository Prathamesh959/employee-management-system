const departmentService = require("../services/departmentService");

const getDepartments = async (req, res) => {
    try {
        const departments = await departmentService.getAllDepartments();
        
        // Ensure SQL strings are parsed to integers for the UI
        const formatted = departments.map(d => ({
            ...d,
            totalEmployees: parseInt(d.totalEmployees || 0, 10),
            activeEmployees: parseInt(d.activeEmployees || 0, 10)
        }));

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ success: false, message: "Failed to fetch departments" });
    }
};

const getDepartmentById = async (req, res) => {
    try {
        const department = await departmentService.getDepartmentById(req.params.id);
        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }
        department.totalEmployees = parseInt(department.totalEmployees || 0, 10);
        department.activeEmployees = parseInt(department.activeEmployees || 0, 10);
        
        res.status(200).json({ success: true, data: department });
    } catch (error) {
        console.error("Error fetching department:", error);
        res.status(500).json({ success: false, message: "Failed to fetch department" });
    }
};

const createDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ success: false, message: "Department name is required" });
        }

        const insertId = await departmentService.createDepartment(name.trim());
        res.status(201).json({ success: true, data: { id: insertId, name: name.trim() } });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: "A department with this name already exists" });
        }
        console.error("Error creating department:", error);
        res.status(500).json({ success: false, message: "Failed to create department" });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ success: false, message: "Department name is required" });
        }

        await departmentService.updateDepartment(req.params.id, name.trim());
        res.status(200).json({ success: true, message: "Department updated successfully" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: "A department with this name already exists" });
        }
        console.error("Error updating department:", error);
        res.status(500).json({ success: false, message: "Failed to update department" });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        await departmentService.deleteDepartment(req.params.id);
        res.status(200).json({ success: true, message: "Department deleted successfully" });
    } catch (error) {
        if (error.code === 'EMPLOYEES_ASSIGNED') {
            return res.status(409).json({ success: false, message: error.message });
        }
        console.error("Error deleting department:", error);
        res.status(500).json({ success: false, message: "Failed to delete department" });
    }
};

module.exports = {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
