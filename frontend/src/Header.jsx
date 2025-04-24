import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isLoggedIn, handleLogout }) => {

    return (
        <header className="header">
            <div className="logo">CLOZ</div>
            <nav className="nav">
                <ul>
                    <li><Link to="/HRdashboard">HR Dashboard</Link></li>
                    <li><Link to="/HRdashboard/list">Employee List</Link></li>
                    <li><Link to="/HRdashboard/add">Add Employee</Link></li>
                    {isLoggedIn ? (
                        <li><button onClick={handleLogout}>Logout</button></li>
                    ) : (
                        <li><Link to="/login">Login</Link></li>
                    )}
                    <li><Link to="/change-password">Change Password</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;