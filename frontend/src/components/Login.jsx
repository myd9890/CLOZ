import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [empID, setEmpID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8070/api/auth/login', { empID, password });
      const { token, employee } = response.data;
      if (!token || !employee || !employee.department || !employee.role) {
        console.error('Invalid login response: Missing required fields.');
        alert('Login failed: Invalid server response.');
        return;
      }
      const userData = {
        token: response.data.token,
        name: response.data.employee.name,
        department: response.data.employee.department,
        role: response.data.employee.role,
      };
      onLogin(userData);

    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Employee ID" value={empID} onChange={(e) => setEmpID(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;