const PDFDocument = require('pdfkit');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { calculateSalary } = require('../utils/salaryCalculation');
const { calculateDayType } = require('../utils/dayTypeCalculation');

const calculateOvertimeHours = (arrivalTime, departureTime) => {
  const normalEndTime = new Date(`1970-01-01T17:00:00Z`);
  const actualEndTime = new Date(`1970-01-01T${departureTime}Z`);

  const overtimeHours = (actualEndTime - normalEndTime) / (1000 * 60 * 60);
  return overtimeHours > 0 ? overtimeHours : 0;
};

const getTodayAttendance = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const attendanceRecords = await Attendance.find({ date: today }).populate('employee');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAttendanceRecord = async (req, res) => {
  const { date, employeeId, arrivalTime, status } = req.body;
  console.log('Received data:', req.body);
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const dayType = calculateDayType(date);
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
    console.error('Error adding attendance record:', error);
    res.status(400).json({ message: error.message });
  }
};

const checkInToday = async (req, res) => {
  const { employeeId, date } = req.params;
  try {
    const attendance = await Attendance.findOne({ employee: employeeId, date, status: 'Present' });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkOut = async (req, res) => {
  const { date, employeeId, departureTime } = req.body;
  try {
    const attendance = await Attendance.findOne({ employee: employeeId, date, status: 'Present' }).populate('employee');
    if (!attendance) return res.status(404).json({ message: 'Employee has not checked in today' });

    attendance.departureTime = departureTime;
    attendance.otHours = calculateOvertimeHours(attendance.arrivalTime, departureTime);
    const updatedAttendance = await attendance.save();

    const salaryDetails = calculateSalary(attendance.employee.basicSalary, attendance.otHours, attendance.dayType);

    res.status(201).json({ updatedAttendance, salaryDetails });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const generateAttendanceReport = async (req, res) => {
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
      doc.text(`Overtime Hours: ${record.otHours}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: error.message });
  }
};

const clearAttendanceRecords = async (req, res) => {
  try {
    const result = await Attendance.deleteMany({});
    res.json({ message: `Deleted ${result.deletedCount} attendance records` });
  } catch (error) {
    console.error('Error deleting attendance records:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTodayAttendance,
  addAttendanceRecord,
  checkInToday,
  checkOut,
  generateAttendanceReport,
  clearAttendanceRecords,
};