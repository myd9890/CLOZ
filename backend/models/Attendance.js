const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  dayType: { type: String, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  arrivalTime: { type: String, required: true },
  status: { type: String, required: true },
  departureTime: { type: String },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;