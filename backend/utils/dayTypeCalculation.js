// List of static holidays in Sri Lanka
const staticHolidays = [
  '01-01', // New Year's Day
  '01-14', // Tamil Thai Pongal Day
  '02-04', // Independence Day
  '03-11', // Maha Shivaratri
  '04-13', // Sinhala and Tamil New Year
  '04-14', // Sinhala and Tamil New Year
  '05-01', // May Day
  '11-04', // Deepavali
  '12-25', // Christmas Day
  // Add other static holidays here
];

// Function to get dynamic holidays for a given year
const getDynamicHolidays = (year) => {
  const dynamicHolidays = [];

  // Diwali dates
  const diwaliDates = {
    2024: '11-01',
    2025: '10-21',
    2026: '11-08'
  };

  // Theravada Poya days
  const theravadaPoyaDays = {
    2024: ['01-25', '02-24', '03-25', '04-23', '05-23', '06-21', '07-21', '08-19', '09-18', '10-17', '11-15', '12-15'],
    2025: ['01-14', '02-13', '03-14', '04-12', '05-12', '06-10', '07-10', '08-08', '09-07', '10-06', '11-05', '12-05'],
    2026: ['01-04', '02-03', '03-04', '04-02', '05-02', '05-31', '06-30', '07-29', '08-28', '09-26', '10-26', '11-24', '12-24']
  };

  // Add Diwali to dynamic holidays
  if (diwaliDates[year]) {
    dynamicHolidays.push(`${year}-${diwaliDates[year]}`);
  }

  // Add Theravada Poya days to dynamic holidays
  if (theravadaPoyaDays[year]) {
    theravadaPoyaDays[year].forEach(day => {
      dynamicHolidays.push(`${year}-${day}`);
    });
  }

  return dynamicHolidays;
};

// Calc dayType by given Date
const calculateDayType = (date) => {
  const dateObj = new Date(date); // Ensure date is a Date object
  const day = dateObj.getDay();
  const dateString = dateObj.toISOString().split('T')[0].slice(5); // Get MM-DD format

  // Check if the date is a static holiday
  if (staticHolidays.includes(dateString)) {
    return 'Special Holiday';
  }

  // Check if the date is a dynamic holiday
  const year = dateObj.getFullYear();
  const dynamicHolidays = getDynamicHolidays(year);
  if (dynamicHolidays.includes(dateObj.toISOString().split('T')[0])) {
    return 'Special Holiday';
  }

  // Check if the date is a weekend
  if (day === 0 || day === 6) {
    return 'Weekend';
  }

  return 'Weekday';
};

module.exports = { calculateDayType, getDynamicHolidays };