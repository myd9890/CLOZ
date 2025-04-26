import React from 'react';
import { Link } from 'react-router-dom';
import './css/Header.css'; // Create this CSS file for the styles

const Header = ({ isLoggedIn, handleLogout }) => {
    return (
        <header className="header-container">
            <div className="header-content">
                <Link to="/" className="logo">
                    <span className="logo-primary">CLOZ</span>
                    <span className="logo-dot">.</span>
                </Link>
                
                <nav className="nav-menu">
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link to="/CustomerDashboard/" className="nav-link">
                                <i className="fas fa-users"></i> Customers
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/HRdashboard" className="nav-link">
                                <i className="fas fa-user-tie"></i> HR
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/SalesDashboard/" className="nav-link">
                                <i className="fas fa-chart-line"></i> Sales
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/FinanceDashboard/" className="nav-link">
                                <i className="fas fa-coins"></i> Finance
                            </Link>
                        </li>
                    </ul>
                </nav>
                
                <div className="auth-actions">
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" className="auth-link">
                                <i className="fas fa-user"></i> Profile
                            </Link>
                            <button onClick={handleLogout} className="logout-btn">
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="login-btn">
                            <i className="fas fa-sign-in-alt"></i> Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;