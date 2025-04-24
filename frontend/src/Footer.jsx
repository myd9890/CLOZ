import React from 'react';
import { Link } from 'react-router-dom';
import './css/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-brand">
                    <span className="footer-logo">CLOZ</span>
                    <p className="footer-slogan">Streamlining your business</p>
                </div>
                
                <nav className="footer-nav">
                    <ul className="footer-links">
                        <li><Link to="/privacy-policy" className="footer-link">Privacy</Link></li>
                        <li><Link to="/terms-of-service" className="footer-link">Terms</Link></li>
                        <li><Link to="/contact-us" className="footer-link">Contact</Link></li>
                    </ul>
                </nav>
            </div>
            
            <div className="footer-bottom">
                <p className="footer-copyright">&copy; {currentYear} CLOZ. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;