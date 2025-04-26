import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function EmployeeProfile() {
  const user = JSON.parse(sessionStorage.getItem('user')); // Retrieve logged-in user details
  const navigate = useNavigate();

  return (
    <div>
      <h1>Employee Profile</h1>
      {user ? (
        <div>
          <p><strong>EmpID:</strong> {user.empID}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Department:</strong> {user.department}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}

      <div style={{ marginTop: '20px' }}>
        <Link to="/change-password">
          <button style={{ marginRight: '10px' }}>Change Password</button>
        </Link>
        {/* <Link to="/HRdashboard/leave-requests">
          <button style={{ marginRight: '10px' }}>Leave Requests</button>
        </Link> */}
        <button onClick={() => navigate('/leave-request')}>Request Leave</button>
      </div>
    </div>
  );
}

export default EmployeeProfile;