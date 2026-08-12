# Employee Management System (EMS)

A full-stack Employee Management System built with React, Node.js, Express, and MySQL. This application provides a modern, responsive interface for managing company personnel, featuring secure authentication, role-based access control, and real-time dashboard analytics.

## Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: 
  - **Admin**: Full access (View, Add, Edit, Delete employees).
  - **HR**: Restricted access (View, Add, Edit employees, but cannot delete).
- **Employee Management (CRUD)**: Create, read, update, and delete employee records securely.
- **Real-Time Dashboard**: Optimized SQL aggregation providing live statistics on total employees, departmental distribution, and employment status.
- **Modern UI**: Clean, responsive frontend designed with CSS Grid and Flexbox, following the Stitch design system.

## Tech Stack

- **Frontend**: React, Vite, React Router, Axios, plain CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL (using `mysql2` driver).
- **Security**: JSON Web Tokens (JWT), bcryptjs, CORS.

## Project Structure

The repository is structured as a monorepo containing both the frontend and backend:

```text
EMS/
├── backend/            # Express.js REST API
│   ├── config/         # Database and environment configurations
│   ├── controllers/    # Request handlers and business logic
│   ├── middleware/     # Auth and role-validation middleware
│   ├── routes/         # API route definitions
│   └── services/       # Database query execution
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── components/ # Reusable UI components (Tables, Modals, Forms)
│   │   ├── context/    # React Context (AuthContext)
│   │   ├── pages/      # Page-level components (Dashboard, Employees, Login)
│   │   └── services/   # Axios API interceptors
└── .gitignore          # Root gitignore protecting env vars and node_modules
```

## Installation & Setup

### 1. Database Configuration
1. Ensure you have **MySQL** installed and running.
2. Create a new database (e.g., `ems_db`).
3. (You will need to run the respective SQL setup script to create the `users`, `employees`, and `departments` tables. Ensure you have seeded at least one Admin user to log in).

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=ems_db
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate user and receive JWT

### Dashboard
- `GET /api/dashboard/stats` - Retrieve aggregated employee statistics (Requires Auth)

### Employees
- `GET /api/employees` - Retrieve all employees (Requires Auth)
- `GET /api/employees/:id` - Retrieve specific employee details (Requires Auth)
- `POST /api/employees` - Create a new employee (Requires Auth)
- `PUT /api/employees/:id` - Update an employee (Requires Auth)
- `DELETE /api/employees/:id` - Delete an employee (Requires Admin Role)

### Departments
- `GET /api/departments` - Retrieve all departments (Requires Auth)

## Security Notes
- Passwords are never stored in plain text.
- The React frontend utilizes an Axios interceptor to automatically attach the JWT `Bearer` token to all requests.
- The Node.js backend features dual-layer protection: `verifyToken` middleware for authentication, and strict Role validation inside specific routes (like `DELETE`) to prevent unauthorized API manipulation.
