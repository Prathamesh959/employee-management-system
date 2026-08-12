const departmentService = require("../services/departmentService");

const getDepartments = async (req, res) => {
    try {
        const departments = await departmentService.getAllDepartments();

        res.status(200).json({
            success: true,
            data: departments,
        });
    } catch (error) {
        console.error("Error fetching departments:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch departments",
        });
    }
};

module.exports = {
    getDepartments,
};
