import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SupplierLogin = () => {
  const [supplierId, setSupplierId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8070/supplier/login', {
        supplierId,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/supplierprofile');
    } catch (error) {
      setError('Invalid supplier ID or password');
    }
  };

  return (
    <div>
      <h2>Supplier Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Supplier ID:</label>
          <input
            type="text"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default SupplierLogin;