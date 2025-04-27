import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LeaveRequestForm( { user }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveType, setLeaveType] = useState('Paid Leave');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [duration, setDuration] = useState(0);
  const navigate = useNavigate();

  const calculateDuration = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
      return duration > 0 ? duration : 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form inputs
    if (!startDate || !endDate || !reason) {
      setError('All fields are required.');
      return;
    }

    const duration = calculateDuration();
    if (duration <= 0) {
      setError('End date must be after the start date.');
      return;
    }

    try {
        // get user's EmpID from the user object
        const empID = user.empID; // Assuming user object has EmpID property
        // post request to the backend with the leave request details
        const response = await axios.post('http://localhost:8070/api/requests', {
            empID, 
            leaveType,
            startDate,
            endDate,
            reason,
            duration
        });
        console.log('Leave request response:', response.data); 
        setStartDate('');
        setEndDate('');
        setReason('');
        setLeaveType('Paid Leave');
        setError('');
        setSuccess('Leave request submitted successfully!');
        setTimeout(() => navigate('/EmployeeProfile'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error submitting leave request:', error);
      setError('Failed to submit leave request. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Leave Request Form</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Reason:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', resize: 'none' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Leave Type:</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="Paid Leave">Paid Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Duration:</label>
          <input
            type="text"
            value={`${calculateDuration()} days`}
            onChange={(e) => setDuration(e.target.value)}
            disabled
            readOnly
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
          />
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default LeaveRequestForm;