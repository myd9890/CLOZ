const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const { calculateSalary } = require('../utils/salaryCalculation');

const calculateOvertimeHours = (arrivalTime, departureTime) => {
  const normalEndTime = new Date(`1970-01-01T17:00:00`);
  const actualEndTime = new Date(`1970-01-01T${departureTime}:00`);

  const overtimeHours = (actualEndTime - normalEndTime) / (1000 * 60 * 60);
  return overtimeHours > 0 ? overtimeHours : 0;
};

// API Salary Calc
router.get('/', async (req, res) => {
  try {
    console.log('Query:', req.query);
    const { month, year } = req.query;
    const employees = await Employee.find();
    const salaryRecords = [];

    for (const employee of employees) {
      const basicSalary = employee.role === 'Manager' ? 50000 : 30000;
      const attendanceRecords = await Attendance.find({
        employee: employee._id,
        $expr: {
          $and: [
            { $gte: [{ $toDate: "$date" }, new Date(`${year}-${month}-01`)] },
            { $lt: [{ $toDate: "$date" }, new Date(`${year}-${parseInt(month) + 1}-01`)] }
          ]
        }
      });

      let otHoursWeekday = 0;
      let otHoursWeekendHoliday = 0;

      attendanceRecords.forEach(record => {
        const otHours = calculateOvertimeHours(record.arrivalTime, record.departureTime);
        if (record.dayType === 'Weekday') {
          otHoursWeekday += otHours;
        } else if (record.dayType === 'Weekend' || record.dayType === 'Special Holiday') {
          otHoursWeekendHoliday += otHours;
        }
      });

      const salaryDetails = calculateSalary(basicSalary, otHoursWeekday, otHoursWeekendHoliday);
      console.log(`Salary Details:`, salaryDetails);
      console.log('Salary Records:', salaryRecords);
      salaryRecords.push({
        empID: employee.empID,
        name: employee.name,
        department: employee.department,
        role: employee.role,
        basicSalary: salaryDetails.basicSalary,
        otHoursWeekday,
        otHoursWeekendHoliday,
        otPay: salaryDetails.totalOtPay,
        totalSalary: salaryDetails.totalSalary,
      });
  
    }

    res.json(salaryRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;