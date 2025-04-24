const e = require("express");

const calculateHourlyRate = (basicSalary) => {
  const workingHoursPerDay = 8;
  const workingDaysPerMonth = 30; // Using 30 days in the month
  return basicSalary / (workingDaysPerMonth * workingHoursPerDay);
};

const calculateOvertimePay = (hourlyRate, otHours, otRate) => {
  return hourlyRate * otHours * otRate;
};

const calculateGrossSalary = (basicSalary, otPay) => {
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

const calculateSalary = (basicSalary, otHoursWeekday, otHoursWeekendHoliday, type) => {
  const hourlyRate = calculateHourlyRate(basicSalary);
  const weekdayOtRate = 1.5;
  const weekendOtRate = 2.0;

  const weekdayOtPay = calculateOvertimePay(hourlyRate, otHoursWeekday, weekdayOtRate);
  const weekendOtPay = calculateOvertimePay(hourlyRate, otHoursWeekendHoliday, weekendOtRate);

  const totalOtPay = weekdayOtPay + weekendOtPay;
  const grossSalary = calculateGrossSalary(basicSalary, totalOtPay);

  let epf = 0;
  let netSalary = 0;
  let etf = 0;
  if (type === 'etf') {
    epf = grossSalary * 0.12;
    etf = grossSalary * 0.03;
    return {
      epf: customFormatNumber(epf),
      etf: customFormatNumber(etf),
    };
  }
  else if (type === 'basic') {
    epf = grossSalary * 0.08;
    netSalary = grossSalary - epf;
    return {
      basicSalary: customFormatNumber(basicSalary),
      hourlyRate: customFormatNumber(hourlyRate),
      weekdayOtPay: customFormatNumber(weekdayOtPay),
      weekendOtPay: customFormatNumber(weekendOtPay),
      totalOtPay: customFormatNumber(totalOtPay),
      grossSalary: customFormatNumber(grossSalary),
      epf: customFormatNumber(epf),
      netSalary: customFormatNumber(netSalary),
    };
  }
};

module.exports = {
  calculateSalary,
};