const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

// Get all employees
router.get('/', getAllEmployees);

// Get a single employee
router.get('/:id', getEmployeeById);

// Add a new employee
router.post('/', addEmployee);

// Update an employee
router.put('/:id', updateEmployee);

// Delete an employee
router.delete('/:id', deleteEmployee);

module.exports = router;