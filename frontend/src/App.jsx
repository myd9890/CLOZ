import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import Attendance from './components/Attendance';
import LeaveRequests from './components/LeaveRequests';
import Reports from './components/Reports';
import Salary from './components/Salary';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import Index from './index';

function AccessControl({ children, requiredRole, requiredDept }) {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (!user) {
    console.log('Access denied: User not logged in.');
    return <Navigate to="/login" />; 
  }

  // if requirerole AND requiredDepartment are not met, deny access
  if (requiredRole && user.role !== requiredRole) {
    console.log(`Access denied: You must have the '${requiredRole}' role to access this page.`);
    return <div>Access Denied: Insufficient role permissions.</div>;
  }
  if (requiredDept === user.department && requiredRole === user.role) {
    console.log(`Access granted: You have AND access`);
    return children;
  }
  else if (requiredDept === user.department || requiredRole === user.role) {
    console.log(`Access granted: You have OR access`);
    return children;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      return null;
    }
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing user from sessionStorage:', error.message);
      sessionStorage.removeItem('user');
      return null;
    }
  });

  const isLoggedIn = !!user?.token;

  const handleLogin = (userData) => {
    try {
      // Store token, department, and role in sessionStorage

      //TODO: When more information about read/write is given, fix proper access control
      sessionStorage.setItem('user', JSON.stringify(userData));
      console.log('Stored User in sessionStorage:', sessionStorage.getItem('user'));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user to sessionStorage:', error.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null); 
    window.location.href = '/login'; 
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      setUser(null); 
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error('Error parsing user from sessionStorage:', error.message);
      sessionStorage.removeItem('user'); 
      setUser(null);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>

          {/* Public Route */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* Protected Routes */}
          <Route
            path="/change-password"
            element={isLoggedIn ? <ChangePassword /> : <Navigate to="/login" />}
          />
          <Route
            path="/HRdashboard/*"
            element={
              <AccessControl requiredDept="HR">
                <HRDashboard user={user} />
              </AccessControl>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

function HRDashboard({ user }) {
  return (
    <div>
      <h1>HR Dashboard</h1>
      <p> Hi {user?.name}</p>
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