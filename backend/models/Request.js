const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
  reqID: { type: String, required: true, unique: true },
  empID: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  reason: { type: String, required: true },
  leaveType: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;