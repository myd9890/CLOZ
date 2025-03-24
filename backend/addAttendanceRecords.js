const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');
const Employee = require('./models/Employee');
require('dotenv').config({ path: './.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1); // Exit the process if the connection fails
  });

// Function to generate dates for the previous month
const getPreviousMonthDates = () => {
  const dates = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
    dates.push(new Date(day).toISOString().split('T')[0]);
  }

  return dates;
};

// Function to add attendance records
const addAttendanceRecords = async () => {
  try {
    const employees = await Employee.find();
    const dates = getPreviousMonthDates();

    for (const employee of employees) {
      console.log(`Processing attendance for employee: ${employee.empID}`);
      for (const date of dates) {
        const dayOfWeek = new Date(date).getDay();
        const dayType = dayOfWeek === 0 || dayOfWeek === 6 ? 'Weekend' : 'Weekday'; // 0 = Sunday, 6 = Saturday
        const status = 'Present'; // Mark all days as Present
        let arrivalTime = '09:00';
        let departureTime = '17:00';

        if (employee.empID.endsWith('1') || employee.empID.endsWith('2')) {
          departureTime = '17:00'; // Normal records on weekdays
        } else if (employee.empID.endsWith('3') || employee.empID.endsWith('4')) {
          departureTime = '20:00'; // Overtime on weekdays
        } else if (employee.empID.endsWith('5') || employee.empID.endsWith('6')) {
          if (dayType === 'Weekend') {
            departureTime = '20:00'; // Overtime on weekends
          } else {
            departureTime = '17:00'; // Normal on weekdays
          }
        } else if (employee.empID.endsWith('7') || employee.empID.endsWith('8')) {
          departureTime = '20:00'; // Overtime on both weekdays and weekends
        }

        const attendance = new Attendance({
          date,
          dayType,
          employee: employee._id,
          arrivalTime,
          status,
          departureTime,
        });

        await attendance.save();
      }
    }

    console.log('Attendance records added successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding attendance records:', error);
    mongoose.connection.close();
  }
};

addAttendanceRecords();