const Employee = require('../models/Employee');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addEmployee = async (req, res) => {
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
};

const updateEmployee = async (req, res) => {
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
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};