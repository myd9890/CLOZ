import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Salary.css'; // Import the CSS file for styling

function Salary() {
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(currentYear.toString());
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [fetched, setFetched] = useState(false);

  const fetchSalaryRecords = async () => {
    try {
      if (!month || !year) {
        console.error('Month and year must be selected');
        return;
      }
      console.log('Fetching salary records for:', month, year);
      const response = await axios.get(`http://localhost:8070/api/salary?month=${month}&year=${year}`);
      console.log('Response:', response.data);
      setSalaryRecords(response.data);
      console.log('Salary Records:', response.data.salaryRecords);
      setFetched(true);
    } catch (error) {
      console.error('Error fetching salary records:', error);
    }
  };

  useEffect(() => {
    setFetched(false);
  }, [month, year]);

  return (
    <div className="salary-container">
      <h1>Salary Details</h1>
      <div>
        <label>
          Month:
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">Select Month</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </label>
        <label>
          Year:
          <input type="number" value={year} readOnly />
        </label>
        <button onClick={fetchSalaryRecords}>Fetch Salary Records</button>
      </div>
      {fetched && (
        <>
          <table className="salary-table">
            <thead>
              <tr>
                <th>EmpID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Role</th>
                <th>Basic Salary</th>
                <th>OT Hours (Weekday)</th>
                <th>OT Hours (Weekend/Holiday)</th>
                <th>OT Pay</th>
                <th>Total Salary</th>
              </tr>
            </thead>
            <tbody>
              {salaryRecords.map((record) => (
                <tr key={record.empID}>
                  <td>{record.empID}</td>
                  <td>{record.name}</td>
                  <td>{record.department}</td>
                  <td>{record.role}</td>
                  <td>{record.basicSalary}</td>
                  <td>{record.otHoursWeekday}</td>
                  <td>{record.otHoursWeekendHoliday}</td>
                  <td>{record.otPay}</td>
                  <td>{record.totalSalary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Salary;