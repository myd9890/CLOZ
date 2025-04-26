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
  console.log('Login attempt with empID:', empID); // Log the empID
  try {
    const employee = await Employee.findOne({ empID });
    if (!employee) return res.status(400).send({ error: 'Invalid login credentials' });

    const isMatch = await bcrypt.compare(password, employee.password);
    // log decrypted passwords, both
    console.log('Provided password:', password); // Log the provided password
    console.log('Stored hashed password:', employee.password); // Log the stored hashed password
    if (!isMatch) return res.status(400).send({ error: 'Invalid login credentials' });
    console.log('Employee found:', employee);
    const token = jwt.sign({ _id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // console log the token
    console.log('Generated token:', token);
    res.send({ employee, token });
  } catch (error) {
    res.status(500).send(error);
  }
};

const changePassword = async (req, res) => {
  console.log('Change password started for empID:', req.employee.empID); // Log the empID
  console.log('Request body:', req.body); // Log the request body
  const { oldPassword, newPassword } = req.body;
  try {
    // Verify the old password
    const isMatch = await bcrypt.compare(oldPassword, req.employee.password);
    if (!isMatch) return res.status(400).send({ error: 'Old password is incorrect' });

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    req.employee.password = await bcrypt.hash(newPassword, salt);
    
    console.log('New hashed password:', req.employee.password); // Log the new hashed password
    
    // Save the updated employee
    const updatedEmployee = await Employee.findByIdAndUpdate(req.employee._id, { password: req.employee.password }, { new: true });
    if (!updatedEmployee) return res.status(404).send({ error: 'Employee not found' });
    console.log('Password updated successfully for empID:', req.employee.empID); // Log success message
    res.send({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).send({ error: 'Server error' });
  }
};

module.exports = {
  registerEmployee,
  loginEmployee,
  changePassword,
};; 