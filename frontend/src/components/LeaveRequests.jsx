import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LeaveRequests( {user} ) {
  const [requestList, setRequestList] = useState([]); // Stores the fetched leave requests
  const [error, setError] = useState(''); // Stores any error messages
  const [loading, setLoading] = useState(true); // Tracks the loading state
  const [userDep, setUserDep] = useState(''); // Stores the user's department

  const fetchLeaveRequests = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(''); // Clear any previous errors
    try {
      console.log('Fetching leave requests...'); // Log the fetching process
      const response = await axios.get('http://localhost:8070/api/requests'); // Updated URL to match correct endpoint
      setRequestList(response.data); // Set the fetched data to the state
      // if user is NOT HR, show only requests for their empID
      
      const userDep = user.department; // Assuming user object has department property
      if (userDep !== 'HR') {
        console.log('User is not HR, filtering requests by empID:', user.empID); // Log the filtering process
        const filteredRequests = response.data.filter(request => request.empID === user.empID);
        setRequestList(filteredRequests); // Filter requests based on user's empID
      }
      // if user is HR, show all requests, except his own empID
      else if (userDep === 'HR') {
        console.log('User is HR, filtering requests by empID:', user.empID); // Log the filtering process
        const filteredRequests = response.data.filter(request => request.empID !== user.empID);
        setRequestList(filteredRequests); // Filter requests based on user's empID
      }
      console.log('Leave requests fetched:', response.data); // Log the fetched data
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError('Failed to fetch leave requests. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // update the request status when approve or reject button is clicked
  const updateRequestStatus = async (reqID, status) => {
    console.log(`Updating request status for ${reqID} to ${status}`); // Log the update process
    try {
      const response = await axios.put(`http://localhost:8070/api/requests/${reqID}`, { reqID, status });
      console.log('Request status updated:', response.data); // Log the updated request
      fetchLeaveRequests(); // Refresh the list after updating
    }
    catch (err) {
      console.error('Error updating request status:', err);
      setError('Failed to update request status. Please try again later.');
    }
  };

  useEffect(() => {
    setUserDep(user.department); // Set user department from props
    fetchLeaveRequests();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (loading) {
    return <p>Loading leave requests...</p>; // Show loading message while fetching
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>; // Show error message if fetching fails
  }

  if (requestList.length === 0) {
    return <p>No leave requests found.</p>; // Show message if no requests are found
  }

  return (
    <div>
      <h1>Leave Requests</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>EMP ID</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Start Date</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>End Date</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Duration</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Reason</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Leave Type</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Status</th>
            {userDep === 'HR' && (
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {requestList.map((request, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{request.empID}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                {new Date(request.startDate).toLocaleDateString()}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                {new Date(request.endDate).toLocaleDateString()}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{request.duration}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{request.reason}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{request.leaveType}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{request.status}</td>
              {userDep === 'HR' && (
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                  <button onClick={() => updateRequestStatus(request.reqID, 'Approved')}>Approve</button>
                  <button onClick={() => updateRequestStatus(request.reqID, 'Rejected')}>Reject</button>
                  <button onClick={() => updateRequestStatus(request.reqID, 'Delete')}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveRequests;