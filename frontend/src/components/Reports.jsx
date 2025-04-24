import React, { useState } from 'react';
import axios from 'axios';
import './Reports.css'; // Import the CSS file for styling

function Reports() {
  const [date, setDate] = useState('');

  const handleChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8070/api/attendance/report/${date}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Attendance_Report_${date}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('No attendance records found for the specified date.');
      } else {
        console.error('Error generating report:', error);
        alert('Failed to generate report. Please try again.');
      }
    }
  };

  return (
    <div className="reports-container">
      <h1>Generate Attendance Report</h1>
      <form onSubmit={handleSubmit} className="reports-form">
        <div className="form-group">
          <label htmlFor="date">Select Date</label>
          <input type="date" id="date" name="date" value={date} onChange={handleChange} required />
        </div>
        <button type="submit">Generate Report</button>
      </form>
    </div>
  );
}

export default Reports;