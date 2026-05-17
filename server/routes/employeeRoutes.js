/**
 * Employee Routes
 * Defines all API endpoints for employee management
 */

const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  getEmployeesByStore,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

// GET employees by store
router.get('/store/:storeId', getEmployeesByStore);

// GET all employees
router.get('/', getAllEmployees);

// GET employee by ID
router.get('/:id', getEmployeeById);

// POST add new employee
router.post('/', createEmployee);

// PUT update employee
router.put('/:id', updateEmployee);

// DELETE employee
router.delete('/:id', deleteEmployee);

module.exports = router;
