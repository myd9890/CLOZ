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
      
      const hiredDate = 0;
      const type = "etf";
      // console.log('hi');
      const etfDetails = calculateSalary(basicSalary, otHoursWeekday, otHoursWeekendHoliday, type);
      // console.log(`ETF Details:`, etfDetails);

      etfRecords.push({
        empID: employee.empID,
        name: employee.name,
        department: employee.department,
        role: employee.role,
        hiredDate: hiredDate,
        epf: etfDetails.epf,
        etf: etfDetails.etf
      });

    
    }
    res.json(etfRecords);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSalaryRecords,
  getETFRecords
};