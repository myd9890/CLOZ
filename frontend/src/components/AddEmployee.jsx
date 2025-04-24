import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddEmployee.css'; // Import the CSS file for styling

function AddEmployee() {
  const [employee, setEmployee] = useState({
    name: '',
    workMobile: '',
    workEmail: '',
    department: '',
    role: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post('http://localhost:8070/api/employees', employee);
      alert('Employee added successfully!');
      navigate('/HRdashboard');
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee. Please try again.');
    }
  };

  const validateForm = () => {
    const { workMobile, workEmail } = employee;
    const mobileRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mobileRegex.test(workMobile)) {
      alert('Please enter a valid work mobile number.');
      return false;
    }

    if (!emailRegex.test(workEmail)) {
      alert('Please enter a valid work email address.');
      return false;
    }

    return true;
  };

  return (
    <div className="form-container">
      <h1>Add New Employee</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Name" value={employee.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="workMobile">Work Mobile</label>
          <input type="text" id="workMobile" name="workMobile" placeholder="Work Mobile" value={employee.workMobile} onChange={handleChange} required pattern="[0-9]+" title="Please enter a valid work mobile number." />
        </div>
        <div className="form-group">
          <label htmlFor="workEmail">Work Email</label>
          <input type="email" id="workEmail" name="workEmail" placeholder="Work Email" value={employee.workEmail} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select id="department" name="department" value={employee.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Inventory">Inventory</option>
            <option value="CRM">CRM</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={employee.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="Manager">Manager</option>
            <option value="Worker">Worker</option>
          </select>
        </div>
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
}

export default AddEmployee;