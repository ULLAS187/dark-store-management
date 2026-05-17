/**
 * Employee Controller
 * ---------------------
 * Handles all CRUD operations for employee management.
 * Includes store-wise employee filtering with JOIN queries.
 * Uses parameterized queries to prevent SQL injection.
 */

const { pool } = require('../config/db');

/**
 * GET /api/employees
 * Retrieve all employees with store details (JOIN query)
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, ds.store_name
      FROM employees e
      INNER JOIN dark_stores ds ON e.store_id = ds.store_id
      ORDER BY e.employee_id DESC
    `);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/employees/:id
 * Retrieve a single employee by ID
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT e.*, ds.store_name
      FROM employees e
      INNER JOIN dark_stores ds ON e.store_id = ds.store_id
      WHERE e.employee_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/employees/store/:storeId
 * Retrieve all employees for a specific store
 */
const getEmployeesByStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const [rows] = await pool.query(`
      SELECT e.*, ds.store_name
      FROM employees e
      INNER JOIN dark_stores ds ON e.store_id = ds.store_id
      WHERE e.store_id = ?
      ORDER BY e.role, e.name
    `, [storeId]);

    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/employees
 * Add a new employee
 */
const createEmployee = async (req, res, next) => {
  try {
    const { name, role, salary, phone_number, store_id } = req.body;

    if (!name || !role || !salary || !phone_number || !store_id) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, role, salary, phone_number, store_id'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO employees (name, role, salary, phone_number, store_id) VALUES (?, ?, ?, ?, ?)',
      [name, role, salary, phone_number, store_id]
    );

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: { employee_id: result.insertId, ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/employees/:id
 * Update an existing employee
 */
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, salary, phone_number, store_id } = req.body;

    if (!name || !role || !salary || !phone_number || !store_id) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const [result] = await pool.query(
      'UPDATE employees SET name = ?, role = ?, salary = ?, phone_number = ?, store_id = ? WHERE employee_id = ?',
      [name, role, salary, phone_number, store_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: { employee_id: parseInt(id), ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/employees/:id
 * Delete an employee
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM employees WHERE employee_id = ?', [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getEmployeesByStore,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
