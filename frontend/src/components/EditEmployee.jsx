import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    name: '',
    workMobile: '',
    workEmail: '',
    department: '',
    role: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`http://localhost:8070/api/employees/${id}`);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8070/api/employees/${id}`, employee);
      alert('Employee updated successfully!');
      navigate('/HRdashboard/list');
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h1>Edit Employee</h1>
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
        <button type="submit">Update Employee</button>
      </form>
    </div>
  );
}

export default EditEmployee;