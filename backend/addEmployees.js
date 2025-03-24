const mongoose = require('mongoose');
const Employee = require('./models/Employee');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const employees = [
  { name: 'Manager 1', workMobile: '1234567890', workEmail: 'manager1@company.com', department: 'HR', role: 'Manager' },
  { name: 'Manager 2', workMobile: '1234567891', workEmail: 'manager2@company.com', department: 'Finance', role: 'Manager' },
  { name: 'Manager 3', workMobile: '1234567892', workEmail: 'manager3@company.com', department: 'Sales', role: 'Manager' },
  { name: 'Manager 4', workMobile: '1234567893', workEmail: 'manager4@company.com', department: 'Inventory', role: 'Manager' },
  { name: 'Manager 5', workMobile: '1234567894', workEmail: 'manager5@company.com', department: 'CRM', role: 'Manager' },
  { name: 'Worker 1', workMobile: '1234567895', workEmail: 'worker1@company.com', department: 'HR', role: 'Worker' },
  { name: 'Worker 2', workMobile: '1234567896', workEmail: 'worker2@company.com', department: 'Finance', role: 'Worker' },
  { name: 'Worker 3', workMobile: '1234567897', workEmail: 'worker3@company.com', department: 'Sales', role: 'Worker' },
  { name: 'Worker 4', workMobile: '1234567898', workEmail: 'worker4@company.com', department: 'Inventory', role: 'Worker' },
  { name: 'Worker 5', workMobile: '1234567899', workEmail: 'worker5@company.com', department: 'CRM', role: 'Worker' },
  { name: 'Worker 6', workMobile: '1234567800', workEmail: 'worker6@company.com', department: 'HR', role: 'Worker' },
  { name: 'Worker 7', workMobile: '1234567801', workEmail: 'worker7@company.com', department: 'Finance', role: 'Worker' },
  { name: 'Worker 8', workMobile: '1234567802', workEmail: 'worker8@company.com', department: 'Sales', role: 'Worker' },
  { name: 'Worker 9', workMobile: '1234567803', workEmail: 'worker9@company.com', department: 'Inventory', role: 'Worker' },
  { name: 'Worker 10', workMobile: '1234567804', workEmail: 'worker10@company.com', department: 'CRM', role: 'Worker' },
  { name: 'Worker 11', workMobile: '1234567805', workEmail: 'worker11@company.com', department: 'HR', role: 'Worker' },
  { name: 'Worker 12', workMobile: '1234567806', workEmail: 'worker12@company.com', department: 'Finance', role: 'Worker' },
  { name: 'Worker 13', workMobile: '1234567807', workEmail: 'worker13@company.com', department: 'Sales', role: 'Worker' },
  { name: 'Worker 14', workMobile: '1234567808', workEmail: 'worker14@company.com', department: 'Inventory', role: 'Worker' },
  { name: 'Worker 15', workMobile: '1234567809', workEmail: 'worker15@company.com', department: 'CRM', role: 'Worker' },
];

employees.forEach((employee, index) => {
  employee.basicSalary = employee.role === 'Manager' ? 5000 : 3000;
  employee.empID = `E${String(index + 1).padStart(3, '0')}`;
  employee.password = employee.empID;
});

Employee.insertMany(employees)
  .then(() => {
    console.log('Employees added successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error adding employees:', err);
    mongoose.connection.close();
  });