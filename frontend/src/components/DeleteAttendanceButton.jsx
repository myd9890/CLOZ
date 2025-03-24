import React from 'react';
import axios from 'axios';

function DeleteAttendanceButton() {
  const handleDelete = async () => {
    try {
      const response = await axios.delete('http://localhost:8070/api/attendance/clear');
      alert(response.data.message);
    } catch (error) {
      console.error('Error deleting attendance records:', error);
      alert('Failed to delete attendance records. Please try again.');
    }
  };

  return (
    <button onClick={handleDelete}>Delete All Attendance Records</button>
  );
}

export default DeleteAttendanceButton;