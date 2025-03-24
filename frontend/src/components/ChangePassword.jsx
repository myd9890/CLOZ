// filepath: c:\2y2s\New folder\CLOZ\frontend\src\components\ChangePassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8070/api/auth/change-password', { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/HRdashboard');
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default ChangePassword;