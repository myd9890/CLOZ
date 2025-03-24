const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single employee
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new employee
router.post('/', async (req, res) => {
  const { name, workMobile, workEmail, department, role } = req.body;
  const lastEmployee = await Employee.findOne().sort({ empID: -1 });
  const empID = lastEmployee ? `E${String(parseInt(lastEmployee.empID.slice(1)) + 1).padStart(3, '0')}` : 'E001';
  const basicSalary = role === 'Manager' ? 5000 : 3000;
  const password = empID.toString(); // Default password is the empID

  const employee = new Employee({
    empID,
    name,
    workMobile,
    workEmail,
    department,
    role,
    basicSalary,
    password,
  });

  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an employee
router.put('/:id', async (req, res) => {
  try {
    const { name, workMobile, workEmail, department, role } = req.body;
    const basicSalary = role === 'Manager' ? 5000 : 3000;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, workMobile, workEmail, department, role, basicSalary },
      { new: true }
    );

    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;