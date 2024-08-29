import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import logo from '../img/logo.jpg';
function Navbar() {
  return (
    <nav className="navbar">  
        <img src={logo} alt="Logo" className="navbar-logo" />
      <ul className="navbar-list">
      <li className="navbar-item"><Link to="/">Trang chủ </Link></li>
       
        <li className="navbar-item"><Link to="/parking">Parking Allocation</Link></li>
        <li className="navbar-item"><Link to="/residents">Resident Info</Link></li>
        <li className="navbar-item"><Link to="/register">Đăng ký</Link></li>    
        <li className="navbar-item"><Link to="/logs">Đăng Nhập</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
