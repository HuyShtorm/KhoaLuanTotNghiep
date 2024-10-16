import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import logo from '../img/logo.jpg';

function Navbar({ isAuthenticated }) {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy vai trò của người dùng từ localStorage sau khi đăng nhập
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
  }, [isAuthenticated]); // Lắng nghe sự thay đổi của isAuthenticated

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
    window.location.reload(); // Reload để cập nhật trạng thái đăng nhập
  };

  return (
    <nav className="navbar">
     <Link to="/">
    <img src={logo} alt="Logo" className="navbar-logo" />
  </Link>
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/">Trang chủ</Link></li>
        <li className="navbar-item"><Link to="/infor">Thông tin Giới thiệu</Link></li>

        {isAuthenticated ? (
          <>
            {userRole === 'USER' && (
              <li className="navbar-item"><Link to="/user">Tài khoản của tôi</Link></li>
            )}
            {userRole === 'ADMIN' && (
              <li className="navbar-item"><Link to="/admin">Trang quản trị</Link></li>
            )}
            {userRole === 'OWNER' && (
              <li className="navbar-item"><Link to="/owner">Trang chủ của chủ sở hữu</Link></li>
            )}
            {userRole === 'MODERATOR' && (
              <li className="navbar-item"><Link to="/moderator">Trang dành cho điều hành viên</Link></li>
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
