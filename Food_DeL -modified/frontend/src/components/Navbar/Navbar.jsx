/*import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");

  const scrollToSection = (id, menuName) => {
    setMenu(menuName);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/"><img src={assets.logo} alt="Logo" className="navbar-logo" /></Link>
        <ul className="navbar-menu">
          <li>
            <Link 
              to="/" 
              className={menu === "home" ? "active" : ""} 
              onClick={() => setMenu("home")}
            >
              Home
            </Link>
          </li>
          <li>
            <button 
              className={menu === "menu" ? "active" : ""} 
              onClick={() => scrollToSection("explore-menu", "menu")}
            >
              Menu
            </button>
          </li>
          <li>
            <button 
              className={menu === "contact" ? "active" : ""} 
              onClick={() => scrollToSection("footer", "contact")}
            >
              Contact
            </button>
          </li>
          <li>
            <button 
              className={menu === "mobile-app" ? "active" : ""} 
              onClick={() => scrollToSection("app-download", "mobile-app")}
            >
              Mobile App
            </button>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <Link to="/cart"><img src={assets.basket_icon} alt="Cart" className="navbar-icon" /></Link>
        <Link to="/search"><img src={assets.search_icon} alt="Search" className="navbar-icon" /></Link>
        <button onClick={() => setShowLogin(true)}>Sign in</button>
      </div>
    </nav>
  );
};

export default Navbar; */

// src/components/Navbar/Navbar.jsx
// src/components/Navbar/Navbar.jsx
import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';


const Navbar = ({ setShowLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, token, setToken } = useContext(StoreContext);
  const [activeMenu, setActiveMenu] = useState('home');

  // Update activeMenu on path change
  useEffect(() => {
    if (location.pathname === '/') setActiveMenu('home');
    else if (location.pathname === '/placeorder') setActiveMenu('orders');
    else setActiveMenu(''); // reset for other paths
  }, [location.pathname]);

  const totalCartItems = Object.values(cartItems).reduce((acc, curr) => acc + curr, 0);

  // Scroll helper for homepage sections (Menu, Contact, Mobile App)
  const scrollToSection = (id, menuName) => {
    setActiveMenu(menuName);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="navbar">
      <Link to="/" className="navbar-logo" onClick={() => setActiveMenu('home')}>
        <img src={assets.logo} alt="Logo" />
      </Link>

      <ul className="navbar-menu">
        <li className={activeMenu === 'home' ? 'active' : ''}>
          <Link to="/" onClick={() => setActiveMenu('home')}>Home</Link>
        </li>

        <li className={activeMenu === 'menu' ? 'active' : ''}>
          <button type="button" onClick={() => scrollToSection('explore-menu', 'menu')}>
            Menu
          </button>
        </li>

        <li className={activeMenu === 'contact' ? 'active' : ''}>
          <button type="button" onClick={() => scrollToSection('footer', 'contact')}>
            Contact
          </button>
        </li>

        <li className={activeMenu === 'mobile-app' ? 'active' : ''}>
          <button type="button" onClick={() => scrollToSection('app-download', 'mobile-app')}>
            Mobile App
          </button>
        </li>

        
      </ul>

      <div className="navbar-right">
        <img
          src={assets.basket_icon}
          alt="Cart"
          className="cart-icon"
          onClick={() => navigate('/cart')}
          style={{ cursor: 'pointer' }}
        />
        {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}

        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
