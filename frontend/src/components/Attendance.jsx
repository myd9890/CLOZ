import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './Attendance.css'; // Import the CSS file for styling

function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [showCheckOutForm, setShowCheckOutForm] = useState(false);

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    date: getCurrentDate(),
    dayType: 'Weekday',
    employeeId: '',
    arrivalTime: '09:00',
    status: 'Present',
  });

  const [checkOutData, setCheckOutData] = useState({
    date: getCurrentDate(),
    employeeId: '',
    departureTime: '17:00',
  });

  useEffect(() => {
    fetchAttendanceRecords();
    fetchEmployees();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get('http://localhost:8070/api/attendance/today');
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8070/api/employees');
      setEmployees(response.data.map(employee => ({
        value: employee._id,
        label: `${employee.empID} - ${employee.name}`
      })));
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCheckOutChange = (e) => {
    const { name, value } = e.target;
    setCheckOutData({
      ...checkOutData,
      [name]: value,
    });
  };

  const handleEmployeeChange = (selectedOption) => {
    setFormData({
      ...formData,
      employeeId: selectedOption ? selectedOption.value : '',
    });
  };

  const handleCheckOutEmployeeChange = (selectedOption) => {
    setCheckOutData({
      ...checkOutData,
      employeeId: selectedOption ? selectedOption.value : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8070/api/attendance', formData);
      alert('Attendance record added successfully!');
      setFormData({
        date: getCurrentDate(),
        dayType: 'Weekday',
        employeeId: '',
        arrivalTime: '09:00',
        status: 'Present',
      });
      fetchAttendanceRecords();
    } catch (error) {
      console.error('Error adding attendance record:', error);
      alert('Failed to add attendance record. Please try again.');
    }
  };

  const handleCheckOutSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8070/api/attendance/checkin/${checkOutData.employeeId}/${checkOutData.date}`);
      if (response.data) {
        await axios.post('http://localhost:8070/api/attendance/checkout', checkOutData);
        alert('Check-out record added successfully!');
        setCheckOutData({
          date: getCurrentDate(),
          employeeId: '',
          departureTime: '17:00',
        });
        fetchAttendanceRecords();
      } else {
        alert('Employee has not checked in today.');
      }
    } catch (error) {
      console.error('Error adding check-out record:', error);
      alert('Failed to add check-out record. Please try again.');
    }
  };

  const filterEmployees = (option, inputValue) => {
    const { label } = option;
    return label.toLowerCase().includes(inputValue.toLowerCase());
  };

  return (
    <div className="attendance-container">
      <h1>Attendance</h1>
      <button onClick={() => { setShowCheckInForm(!showCheckInForm); setShowCheckOutForm(false); }}>Mark Check-In</button>
      <button onClick={() => { setShowCheckOutForm(!showCheckOutForm); setShowCheckInForm(false); }}>Mark Check-Out</button>
      {showCheckInForm && (
        <form onSubmit={handleSubmit} className="attendance-form">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Day Type</label>
            <div className="toggle-radio">
              <input type="radio" name="dayType" id="weekday" value="Weekday" checked={formData.dayType === 'Weekday'} onChange={handleChange} />
              <label htmlFor="weekday">Weekday</label>
              <input type="radio" name="dayType" id="weekend" value="Weekend" checked={formData.dayType === 'Weekend'} onChange={handleChange} />
              <label htmlFor="weekend">Weekend</label>
              <input type="radio" name="dayType" id="specialHoliday" value="Special Holiday" checked={formData.dayType === 'Special Holiday'} onChange={handleChange} />
              <label htmlFor="specialHoliday">Special Holiday</label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID</label>
            <Select
              id="employeeId"
              name="employeeId"
              options={employees}
              onChange={handleEmployeeChange}
              isClearable
              placeholder="Select Employee"
              filterOption={filterEmployees}
            />
          </div>
          <div className="form-group">
            <label htmlFor="arrivalTime">Arrival Time</label>
            <input type="time" id="arrivalTime" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} required>
              <option value="Present">Present</option>
              <option value="Paid Leave">Paid Leave</option>
              <option value="Leave">Leave</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
      {showCheckOutForm && (
        <form onSubmit={handleCheckOutSubmit} className="attendance-form">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" value={checkOutData.date} onChange={handleCheckOutChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID</label>
            <Select
              id="employeeId"
              name="employeeId"
              options={employees}
              onChange={handleCheckOutEmployeeChange}
              isClearable
              placeholder="Select Employee"
              filterOption={filterEmployees}
            />
          </div>
          <div className="form-group">
            <label htmlFor="departureTime">Departure Time</label>
            <input type="time" id="departureTime" name="departureTime" value={checkOutData.departureTime} onChange={handleCheckOutChange} required />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
      <h2>Absent Employees Today</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>EmpID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Leave Type</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords
            .filter((record) => record.status !== 'Present')
            .map((record) => (
              <tr key={record._id}>
                <td>{record.employee.empID}</td>
                <td>{record.employee.name}</td>
                <td>{record.status}</td>
                <td>{record.status === 'Paid Leave' ? 'Paid Leave' : 'Leave'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Attendance;