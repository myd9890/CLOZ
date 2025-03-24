const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  empID: { type: String, unique: true }, // Change this to String
  name: { type: String, required: true },
  workMobile: { type: String, required: true },
  workEmail: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  basicSalary: { type: Number, required: true }, // Add basicSalary field
  password: { type: String, required: true },
});

// Hash the password before saving
employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;