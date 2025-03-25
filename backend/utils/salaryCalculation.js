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

const customFormatNumber = (number) => {
  let [integerPart, decimalPart] = number.toFixed(2).split('.');
  if (parseInt(decimalPart) > 59) {
    integerPart = (parseInt(integerPart) + 1).toString();
    decimalPart = '00';
  }
  return `${parseInt(integerPart).toLocaleString('en-US')}.${decimalPart}`;
};

const calculateSalary = (basicSalary, otHoursWeekday, otHoursWeekendHoliday) => {
  const hourlyRate = calculateHourlyRate(basicSalary);
  const weekdayOtRate = 1.5;
  const weekendOtRate = 2.0;

  const weekdayOtPay = calculateOvertimePay(hourlyRate, otHoursWeekday, weekdayOtRate);
  const weekendOtPay = calculateOvertimePay(hourlyRate, otHoursWeekendHoliday, weekendOtRate);

  const totalOtPay = weekdayOtPay + weekendOtPay;
  const totalSalary = calculateTotalSalary(basicSalary, totalOtPay);

  return {
    basicSalary: customFormatNumber(basicSalary),
    hourlyRate: customFormatNumber(hourlyRate),
    weekdayOtPay: customFormatNumber(weekdayOtPay),
    weekendOtPay: customFormatNumber(weekendOtPay),
    totalOtPay: customFormatNumber(totalOtPay),
    totalSalary: customFormatNumber(totalSalary)
  };
};

module.exports = {
  calculateSalary,
};