import React from 'react';
import { Link } from 'react-router-dom';

import DeleteAttendanceButton from './components/DeleteAttendanceButton';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2023 CLOZ. All rights reserved.</p>
                {/* <DeleteAttendanceButton /> */}
                <nav className="footer-nav">
                    <ul>
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/terms-of-service">Terms of Service</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;