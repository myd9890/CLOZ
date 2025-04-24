const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  dayType: { type: String, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  arrivalTime: { type: String, required: true },
  status: { type: String, required: true },
  departureTime: { type: String },
  otHours: { type: Number, default: 0 }, // Add this field
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;