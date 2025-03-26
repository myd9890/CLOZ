const express = require('express');
const router = express.Router();
const {
  getTodayAttendance,
  addAttendanceRecord,
  checkInToday,
  checkOut,
  generateAttendanceReport,
  clearAttendanceRecords,
} = require('../controllers/attendanceController');

// Get today's attendance records
router.get('/today', getTodayAttendance);

// Add a new attendance record
router.post('/', addAttendanceRecord);

// Check if an employee has checked in today
router.get('/checkin/:employeeId/:date', checkInToday);

// Add a new check-out record
router.post('/checkout', checkOut);

// Generate attendance report as PDF
router.get('/report/:date', generateAttendanceReport);

// Delete all attendance records
router.delete('/clear', clearAttendanceRecords);

module.exports = router;