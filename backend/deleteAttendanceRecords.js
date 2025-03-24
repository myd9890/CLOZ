const mongoose = require('mongoose');
const Attendance = require('./models/Attendance'); // Adjust the path to your Attendance model
require('dotenv').config(); // Ensure you have dotenv configured to load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    deleteAllAttendanceRecords();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Function to delete all attendance records
const deleteAllAttendanceRecords = async () => {
  try {
    const result = await Attendance.deleteMany({});
    console.log(`Deleted ${result.deletedCount} attendance records`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error deleting attendance records:', error);
    mongoose.connection.close();
  }
};