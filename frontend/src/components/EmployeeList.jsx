import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EmployeeList.css'; // Import the CSS file for styling

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8070/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8070/api/employees/${id}`);
      setEmployees(employees.filter(employee => employee._id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/HRdashboard/edit/${id}`);
  };

  return (
    <div className="employee-list-container">
      <h1>Employee List</h1>
      <table className="employee-table">
        <thead>
          <tr>
            <th>EmpID</th>
            <th>Name</th>
            <th>Work Mobile</th>
            <th>Work Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.empID}</td>
              <td>{employee.name}</td>
              <td>{employee.workMobile}</td>
              <td>{employee.workEmail}</td>
              <td>{employee.department}</td>
              <td>{employee.role}</td>
              <td>
                <button onClick={() => handleUpdate(employee._id)}>Update</button>
                <button onClick={() => handleDelete(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;