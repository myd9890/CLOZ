const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const employeeRoutes = require('./routes/employees');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const salaryRoutes = require('./routes/salary'); // Add this line
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8070;

console.log('MongoDB URL:', process.env.MONGODB_URL); // Add this line to check the MongoDB URL

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salary', salaryRoutes); // Add this line

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
