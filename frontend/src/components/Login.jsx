import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login({ onLogin }) {
  const [empID, setEmpID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8070/api/auth/login', { empID, password });
      const { token, employee } = response.data;
      
      if (!token || !employee || !employee.department || !employee.role) {
        console.error('Invalid login response: Missing required fields.');
        setError('Login failed: Invalid server response.');
        return;
      }

      const userData = {
        token: token,
        name: employee.name,
        department: employee.department,
        role: employee.role,
      };
      
      onLogin(userData);
      
      // Redirect based on department
      switch(employee.department.toLowerCase()) {
        case 'inventory':
          navigate('/InventoryDashboard/products');
          break;
        case 'finance':
          navigate('/FinanceDashboard');
          break;
        case 'sales':
          navigate('/SalesDashboard/sales');
          break;
        case 'crm':
          navigate('/CustomerDashboard/customers');
          break;
        case 'hr':
          navigate('/HRdashboard/list');
          break;
        default:
          navigate('/'); // Fallback to home if department not matched
      }

    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>CLOZ Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Employee ID</label>
            <input
              type="text"
              placeholder="Enter your Employee ID"
              value={empID}
              onChange={(e) => setEmpID(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;