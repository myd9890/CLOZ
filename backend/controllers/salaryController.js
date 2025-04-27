const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const { calculateSalary } = require('../utils/salaryCalculation');

const calculateOvertimeHours = (arrivalTime, departureTime) => {
  const normalEndTime = new Date(`1970-01-01T17:00:00`);
  const actualEndTime = new Date(`1970-01-01T${departureTime}:00`);

  const overtimeHours = (actualEndTime - normalEndTime) / (1000 * 60 * 60);
  return overtimeHours > 0 ? overtimeHours : 0;
};

const getSalaryRecords = async (req, res) => {
  try {
    // console.log('Query:', req.query);
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
      const type = "basic";
      const salaryDetails = calculateSalary(basicSalary, otHoursWeekday, otHoursWeekendHoliday, type);
      // console.log(`Salary Details:`, salaryDetails);
      // console.log('Salary Records:', salaryRecords);
      salaryRecords.push({
        empID: employee.empID,
        name: employee.name,
        department: employee.department,
        role: employee.role,
        basicSalary: salaryDetails.basicSalary,
        otHoursWeekday,
        otHoursWeekendHoliday,
        otPay: salaryDetails.totalOtPay,
        grossSalary: salaryDetails.grossSalary,
        epf: salaryDetails.epf,
        netSalary: salaryDetails.netSalary
      });
    }

    res.json(salaryRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getETFRecords = async (req, res) => {
  try {
    // get all employees & all attendance records
    const employees = await Employee.find();
    const attendanceRecords = await Attendance.find();
    const etfRecords = [];
    const startDate = new Date('1000-01-01');
    const endDate = new Date('3000-12-30');
    

    for (const employee of employees) {
      // filter attendance records for the employee
      const basicSalary = employee.role === 'Manager' ? 50000 : 30000;
      const attendanceRecords = await Attendance.find({
        employee: employee._id,
        $expr: {
          $and: [
            { $gte: [{ $toDate: "$date" }, startDate] },
            { $lt: [{ $toDate: "$date" }, endDate] }
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
      
      const hiredDate = await getFirstAttendDate(employee.empID);
      console.log(`Hired Date:`, hiredDate);
      const type = "etf";
      // console.log('hi');
      // if hiredDate is null or undefined, skip this employee
      const etfDetails = calculateSalary(basicSalary, otHoursWeekday, otHoursWeekendHoliday, type);
      // console.log(`ETF Details:`, etfDetails);
      let finalEPF = etfDetails.epf;
      let finalETF = etfDetails.etf;
      if (!hiredDate) {
        finalEPF = 0;
        finalETF = 0;
      }

      etfRecords.push({
        empID: employee.empID,
        name: employee.name,
        department: employee.department,
        role: employee.role,
        hiredDate: hiredDate,
        epf: finalEPF,
        etf: finalETF
      });

    
    }
    res.json(etfRecords);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFirstAttendDate = async (empID) => {
  try {
    // Find the employee's ObjectId using the empID
    const employee = await Employee.findOne({ empID });
    if (!employee) {
      throw new Error(`Employee with empID "${empID}" not found`);
    }

    // Use the employee's ObjectId to query the Attendance collection
    const attendanceRecord = await Attendance.findOne({ employee: employee._id }).sort({ date: 1 });
    if (!attendanceRecord) {
      return null; // Return null if no attendance records are found
    }

    return attendanceRecord.date; // Return the date as a string
  } catch (error) {
    throw new Error(error.message); // Throw an error if something goes wrong
  }
};
module.exports = {
  getSalaryRecords,
  getETFRecords
};