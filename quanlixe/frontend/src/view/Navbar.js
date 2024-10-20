import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import logo from '../img/logo.jpg';

function Navbar({ isAuthenticated, handleHomeClick, handleUserOrAdminClick, setShowSidebar }) {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" onClick={handleHomeClick}>  {/* Khi nhấn vào logo thì sẽ gọi hàm handleHomeClick */}
        <img src={logo} alt="Logo" className="navbar-logo" />
      </Link>
      <ul className="navbar-list">
        <li className="navbar-item">
        <Link to="/" onClick={() => { handleHomeClick(); setShowSidebar(false); }}>Trang chủ</Link>
        </li>
        <li className="navbar-item">
        <Link to="/infor" onClick={() => { handleHomeClick(); setShowSidebar(false); }}>Thông tin Giới thiệu</Link>
        </li>

        {isAuthenticated ? (
          <>
           {userRole === 'USER' && (
  <li className="navbar-item">
    <Link to="/myvehicles" onClick={() => { handleUserOrAdminClick(); setShowSidebar(true); }}>Xe của tôi</Link>
  </li>
)}
{userRole === 'ADMIN' && (
  <li className="navbar-item">
    <Link to="/managevehicles" onClick={() => { handleUserOrAdminClick(); setShowSidebar(true); }}>Quản lý xe</Link>
  </li>
)}

            <li className="navbar-item">
              <a href="#" onClick={handleLogout} className="navbar-link">Đăng xuất</a>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item"><Link to="/register">Đăng ký</Link></li>
            <li className="navbar-item"><Link to="/login">Đăng Nhập</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
