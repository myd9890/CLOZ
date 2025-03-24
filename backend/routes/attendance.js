const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Attendance = require('../models/Attendance'); // Adjust the path to your Attendance model
const Employee = require('../models/Employee'); // Adjust the path to your Employee model
const { calculateSalary } = require('../utils/salaryCalculation'); // Adjust the path to your salary calculation utility

const calculateOvertimeHours = (arrivalTime, departureTime) => {
  const normalEndTime = new Date(`1970-01-01T17:00:00`);
  const actualEndTime = new Date(`1970-01-01T${departureTime}:00`);

  const overtimeHours = (actualEndTime - normalEndTime) / (1000 * 60 * 60);
  return overtimeHours > 0 ? overtimeHours : 0;
};

// Get today's attendance records
router.get('/today', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const attendanceRecords = await Attendance.find({ date: today }).populate('employee');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new attendance record
router.post('/', async (req, res) => {
  const { date, dayType, employeeId, arrivalTime, status } = req.body;
  console.log('Received data:', req.body); // Add this line to log the received data
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const attendance = new Attendance({
      date,
      dayType,
      employee: employeeId,
      arrivalTime,
      status,
    });

    const newAttendance = await attendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    console.error('Error adding attendance record:', error); // Add this line to log the error
    res.status(400).json({ message: error.message });
  }
});

// Check if an employee has checked in today
router.get('/checkin/:employeeId/:date', async (req, res) => {
  const { employeeId, date } = req.params;
  try {
    const attendance = await Attendance.findOne({ employee: employeeId, date, status: 'Present' });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new check-out record
router.post('/checkout', async (req, res) => {
  const { date, employeeId, departureTime } = req.body;
  try {
    const attendance = await Attendance.findOne({ employee: employeeId, date, status: 'Present' }).populate('employee');
    if (!attendance) return res.status(404).json({ message: 'Employee has not checked in today' });

    attendance.departureTime = departureTime;
    const updatedAttendance = await attendance.save();

    const otHours = calculateOvertimeHours(attendance.arrivalTime, departureTime);
    const salaryDetails = calculateSalary(attendance.employee.basicSalary, otHours, attendance.dayType);

    res.status(201).json({ updatedAttendance, salaryDetails });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate attendance report as PDF
router.get('/report/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const attendanceRecords = await Attendance.find({ date }).populate('employee');

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: 'No attendance records found for the specified date' });
    }

    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment;filename=Attendance_Report_${date}.pdf`,
      }).end(pdfData);
    });

    doc.fontSize(25).text(`Attendance Report for ${date}`, { align: 'center' });
    doc.moveDown();

    attendanceRecords.forEach(record => {
      if (record.employee) {
        doc.text(`EmpID: ${record.employee.empID}`);
        doc.text(`Role: ${record.employee.role}`);
      } else {
        doc.text(`EmpID: Not Available`);
        doc.text(`Role: Not Available`);
      }
      doc.text(`Arrival Time: ${record.arrivalTime}`);
      doc.text(`Departure Time: ${record.departureTime}`);
      doc.text(`Status: ${record.status}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get salary records
router.get('/salary', async (req, res) => {
  try {
    const { month, year } = req.query;
    const employees = await Employee.find();
    const salaryRecords = [];

    const daysInMonth = new Date(year, month, 0).getDate();

    for (const employee of employees) {
      const attendanceRecords = await Attendance.find({
        employee: employee._id,
        date: {
          $gte: new Date(`${year}-${month}-01`),
          $lt: new Date(`${year}-${parseInt(month) + 1}-01`)
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

      const salaryDetails = calculateSalary(employee.basicSalary, otHoursWeekday, otHoursWeekendHoliday);

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

// Delete all attendance records
router.delete('/clear', async (req, res) => {
  try {
    const result = await Attendance.deleteMany({});
    res.json({ message: `Deleted ${result.deletedCount} attendance records` });
  } catch (error) {
    console.error('Error deleting attendance records:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;