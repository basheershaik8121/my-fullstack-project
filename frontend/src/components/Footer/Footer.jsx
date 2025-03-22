import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
    return (
        <footer className='footer' id='footer'>
            <div className="footer-content">
                {/* Left Section */}
                <div className="footer-content-left">
                    <h2 className="footer-logo">Tomato</h2>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>

                    {/* Social Media Icons */}
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="Facebook" />
                        <img src={assets.twitter_icon} alt="Twitter" />
                        <img src={assets.linkedin_icon} alt="LinkedIn" />
                    </div>
                </div>

                {/* Center Section */}
                <div className="footer-content-center">
                    <h3>COMPANY</h3>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Delivery</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* Right Section */}
                <div className="footer-content-right">
                    <h3>GET IN TOUCH</h3>
                    <p>+91 6301251255</p>
                    <p>contact@tomato.com</p>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright 2024 © Tomato.com - All Rights Reserved.</p>
        </footer>
    );
};

export default Footer;
