import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();  // ✅ Initialize navigate function

    return (
        <div className="navbar">
            <img src={assets.logo} alt="Logo" className="navbar-logo" />
            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
                <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
                <a href='#app-download' onClick={() => setMenu("about")} className={menu === "about" ? "active" : ""}>About</a>
                <a href='#footer' onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>Contact</a>
            </ul>

            <div className="navbar-right">
                <img src={assets.search_icon} alt="Search Icon" />
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="Basket Icon" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>

                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Sign In</button>
                ) : (
                    <div className='navbar-profile'>
                        <img src={assets.profile_icon} alt="Profile Icon" />
                        <ul className="nav-profile-dropdown">
                            <li onClick={() => navigate('/myorders')}>  {/* ✅ Fixed syntax issue */}
                                <img src={assets.bag_icon} alt="Orders" />
                                <p>Orders</p>
                            </li>
                            <hr />
                            <li onClick={() => setToken(null)}> 
                                <img src={assets.logout_icon} alt="Logout" />
                                <p>Logout</p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
