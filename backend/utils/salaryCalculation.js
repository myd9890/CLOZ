const calculateHourlyRate = (basicSalary) => {
  const workingHoursPerDay = 8;
  const workingDaysPerMonth = 30; // Using 30 days in the month
  return basicSalary / (workingDaysPerMonth * workingHoursPerDay);
};

const calculateOvertimePay = (hourlyRate, otHours, otRate) => {
  return hourlyRate * otHours * otRate;
};

const calculateTotalSalary = (basicSalary, otPay) => {
  return basicSalary + otPay;
};

const calculateSalary = (basicSalary, otHoursWeekday, otHoursWeekendHoliday) => {
  const hourlyRate = calculateHourlyRate(basicSalary);
  const weekdayOtRate = 1.5;
  const weekendOtRate = 2.0;

  const weekdayOtPay = calculateOvertimePay(hourlyRate, otHoursWeekday, weekdayOtRate);
  const weekendOtPay = calculateOvertimePay(hourlyRate, otHoursWeekendHoliday, weekendOtRate);

  const totalOtPay = weekdayOtPay + weekendOtPay;
  const totalSalary = calculateTotalSalary(basicSalary, totalOtPay);

  return { basicSalary, hourlyRate, weekdayOtPay, weekendOtPay, totalOtPay, totalSalary };
};

module.exports = {
  calculateSalary,
};