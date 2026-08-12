/**
 * Role-based authorization middleware.
 *
 * Usage:
 *   authorizeRoles('Admin')           → only Admin
 *   authorizeRoles('Admin', 'HR')     → Admin or HR
 *
 * Must be used AFTER authMiddleware (which sets req.user).
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // If req.user is missing, authentication was skipped or failed
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Not authenticated.",
            });
        }

        // Check if the user's role is in the allowed list
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Requires one of the following roles: ${allowedRoles.join(", ")}`,
            });
        }

        next();
    };
};

module.exports = authorizeRoles;
