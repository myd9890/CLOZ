const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const registerEmployee = async (req, res) => {
  const { name, workMobile, workEmail, department, role, assignedManager } = req.body;
  const lastEmployee = await Employee.findOne().sort({ empID: -1 });
  const empID = lastEmployee ? lastEmployee.empID + 1 : 1;
  const password = empID.toString(); // Default password is the empID

  const employee = new Employee({
    empID,
    name,
    workMobile,
    workEmail,
    department,
    role,
    assignedManager,
    password,
  });

  try {
    const newEmployee = await employee.save();
    res.status(201).send(newEmployee);
  } catch (error) {
    res.status(400).send(error);
  }
};

const loginEmployee = async (req, res) => {
  const { empID, password } = req.body;
  try {
    const employee = await Employee.findOne({ empID });
    if (!employee) return res.status(400).send({ error: 'Invalid login credentials' });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).send({ error: 'Invalid login credentials' });

    const token = jwt.sign({ _id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ employee, token });
  } catch (error) {
    res.status(500).send(error);
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const isMatch = await bcrypt.compare(oldPassword, req.employee.password);
    if (!isMatch) return res.status(400).send({ error: 'Old password is incorrect' });

    req.employee.password = newPassword;
    await req.employee.save();
    res.send({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  registerEmployee,
  loginEmployee,
  changePassword,
};