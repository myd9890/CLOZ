import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import Attendance from './components/Attendance';
import LeaveRequests from './components/LeaveRequests';
import Reports from './components/Reports';
import Salary from './components/Salary';
import DeleteAttendanceButton from './components/DeleteAttendanceButton';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/HRdashboard">HR Dashboard</Link></li>
            <li><Link to="/HRdashboard/list">Employee List</Link></li>
            <li><Link to="/HRdashboard/add">Add Employee</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/change-password">Change Password</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/HRdashboard/*" element={<HRDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
        <DeleteAttendanceButton />
      </div>
    </Router>
  );
}

function HRDashboard() {
  return (
    <div>
      <h1>HR Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/HRdashboard/attendance">Attendance</Link></li>
          <li><Link to="/HRdashboard/leave-requests">Leave Requests</Link></li>
          <li><Link to="/HRdashboard/reports">Reports</Link></li>
          <li><Link to="/HRdashboard/salary">Salary</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="list" element={<EmployeeList />} />
        <Route path="add" element={<AddEmployee />} />
        <Route path="edit/:id" element={<EditEmployee />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave-requests" element={<LeaveRequests />} />
        <Route path="reports" element={<Reports />} />
        <Route path="salary" element={<Salary />} />
      </Routes>
    </div>
  );
}

export default App;
