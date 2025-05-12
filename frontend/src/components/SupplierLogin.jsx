import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/supplierLogin.css'; 

const LoginPage = () => {
  const [supplierId, setSupplierId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Fetch all suppliers from the backend
      const response = await axios.get('http://localhost:8070/supplier/');
      const suppliers = response.data;
      console.log(suppliers);

      // Find a supplier with matching credentials
      const matchedSupplier = suppliers.find(
        (supplier) => 
          supplier.supplierId === supplierId && 
          supplier.password === password
      );

      if (matchedSupplier) {
        // Credentials match - navigate to supplier page with the supplierId
        navigate(`/supplier/${supplierId}`);
      } else {
        setError('Invalid supplier ID or password');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Supplier Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="supplierId">Supplier ID</label>
            <input
              type="text"
              id="supplierId"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default LoginPage;