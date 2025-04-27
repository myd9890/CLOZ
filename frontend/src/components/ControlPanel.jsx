import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ControlPanel() {
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [totalEmployeeCount, setTotalEmployeeCount] = useState(0);

  const fetchAttendance = async () => {
    try {
      // Fetch Total Employees
      await fetchTotalEmployeeCount();

      // Fetch Today's Attendance Records
      await fetchTodayAttendanceCount();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTotalEmployeeCount = async () => {
    try {
      const response = await axios.get('http://localhost:8070/api/employees');
      setTotalEmployeeCount(response.data.length);
      console.log('Total employees:', response.data.length);
    } catch (error) {
      console.error('Error fetching employee count:', error);
    }
  };

  const fetchTodayAttendanceCount = async () => {
    try {
      const response = await axios.get('http://localhost:8070/api/attendance/today');
      setAttendanceCount(response.data.length); // Assuming the API returns an array of attendance records
      console.log('Today\'s attendance records:', response.data);
    } catch (error) {
      console.error('Error fetching today\'s attendance records:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', padding: '20px' }}>
      {/* Left Segment */}
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px' }}>
        <h3>Statistics</h3>
        <button onClick={fetchAttendance} style={{ marginBottom: '10px' }}>
          Fetch Today's Attendance Records
        </button>
        <p>Attended Today: {attendanceCount}</p>
        <p>Absent Today: {totalEmployeeCount - attendanceCount}</p>
        <p>Total Employees: {totalEmployeeCount}</p>
      </div>

      {/* Right Segment */}
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px' }}>
        <h3>Actions</h3>
        <Link to="/HRdashboard/list">
          <button style={{ display: 'block', marginBottom: '10px', width: '100%' }}>
            Employee List
          </button>
        </Link>
        <Link to="/HRdashboard/attendance">
          <button style={{ display: 'block', marginBottom: '10px', width: '100%' }}>
            Mark Attendance
          </button>
        </Link>
        <Link to="/HRdashboard/add">
          <button style={{ display: 'block', marginBottom: '10px', width: '100%' }}>
            Add Employee
          </button>
        </Link>
        <Link to="/leave-requests">
          <button style={{ display: 'block', marginBottom: '10px', width: '100%' }}>
            Leave Requests
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ControlPanel;