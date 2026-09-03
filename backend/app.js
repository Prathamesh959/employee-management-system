const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

// ---------- Built-in Middleware ----------
app.use(cors({
  origin: [
    'https://employee-management-system-nu-roan.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.use('/api', healthRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({
    status: 'ERROR',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({
    status: 'ERROR',
    message: 'Internal server error',
  });
});

module.exports = app;
