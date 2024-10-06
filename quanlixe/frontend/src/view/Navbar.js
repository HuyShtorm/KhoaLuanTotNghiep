import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import logo from '../img/logo.jpg';

function Navbar({ isUserPage, isAdminPage }) {
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="navbar-logo" />
      <ul className="navbar-list">
        {!isUserPage && !isAdminPage ? (
          <>
            <li className="navbar-item"><Link to="/">Trang chủ</Link></li>
            <li className="navbar-item"><Link to="/infor">Thông tin Giới thiệu</Link></li>
    
            <li className="navbar-item"><Link to="/register">Đăng ký</Link></li>    
            <li className="navbar-item"><Link to="/login">Đăng Nhập</Link></li>
            {/* <li className="navbar-item"><Link to="/user">User</Link></li>
            <li className="navbar-item"><Link to="/admin">Admin</Link></li> */}
          </>
        ) : isUserPage ? (
          <>
            <li className="navbar-item"><Link to="/">Trang chủ</Link></li>
            <li className="navbar-item"><Link to="/user">Tài khoản của tôi</Link></li>
            <li className="navbar-item"><Link to="/">Đăng xuất</Link></li>
          </>
        ) : (
          <>
            <span className="td">Trang quản trị</span>
            <li className="navbar-item"><Link to="/">Trang chủ</Link></li>
            <li className="navbar-item"><Link to="/admin">Trang quản trị</Link></li>
            <li className="navbar-item"><Link to="/">Đăng xuất</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
