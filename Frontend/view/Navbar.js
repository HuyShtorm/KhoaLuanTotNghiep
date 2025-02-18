// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../css/Navbar.css';
// import logo from '../img/logo.jpg';

// function Navbar({ isAuthenticated, handleHomeClick, handleUserOrAdminClick, setShowSidebar }) {
//   const [userRole, setUserRole] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const role = localStorage.getItem('userRole');
//     if (role) {
//       setUserRole(role);
//     }
//   }, [isAuthenticated]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userRole');
//     navigate('/login');
//     window.location.reload();
//   };

//   return (
//     <nav className="navbar">
//       <Link to="/" onClick={handleHomeClick}>  {/* Khi nhấn vào logo thì sẽ gọi hàm handleHomeClick */}
//         <img src={logo} alt="Logo" className="navbar-logo" />
//       </Link>
//       <ul className="navbar-list">
//         <li className="navbar-item">
//         <Link to="/" onClick={() => { handleHomeClick(); setShowSidebar(false); }}>Trang chủ</Link>
//         </li>
//         <li className="navbar-item">
//         <Link to="/infor" onClick={() => { handleHomeClick(); setShowSidebar(false); }}>Thông tin Giới thiệu</Link>
//         </li>
//         <li className="navbar-item">
//         <Link to="/map" onClick={() => { handleHomeClick(); setShowSidebar(false); }}>Sơ Đồ Chung Cư và Bãi Đỗ</Link>
//         </li>
//         {isAuthenticated ? (
//           <>
//            {userRole === 'USER' && (
//   <li className="navbar-item">
//     <Link to="/userprofile" onClick={() => { handleUserOrAdminClick(); setShowSidebar(true); }}>Xe của tôi</Link>
//   </li>
// )}
// {userRole === 'ADMIN' && (
//   <li className="navbar-item">
//     <Link to="/managevehicles" onClick={() => { handleUserOrAdminClick(); setShowSidebar(true); }}>Quản lý xe</Link>
//   </li>
// )}

//             <li className="navbar-item">
//               <a href="#" onClick={handleLogout} className="navbar-link">Đăng xuất</a>
//             </li>
//           </>
//         ) : (
//           <>
//             <li className="navbar-item"><Link to="/register">Đăng ký</Link></li>
//             <li className="navbar-item"><Link to="/login">Đăng Nhập</Link></li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// }

// export default Navbar;
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import logo from '../img/logo.jpg';

function Navbar({ isAuthenticated, handleHomeClick, handleUserOrAdminClick, setShowSidebar }) {
  const [userRole, setUserRole] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Thêm trạng thái menu
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Đảo trạng thái menu (ẩn/hiện)
  };

  return (
    <nav className="navbar">
      <Link to="/" onClick={handleHomeClick}>  {/* Khi nhấn vào logo thì sẽ gọi hàm handleHomeClick */}
        <img src={logo} alt="Logo" className="navbar-logo" />
      </Link>

      {/* Nút hamburger */}
      <button className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </button>

      {/* Danh sách menu */}
      <ul className={`navbar-list ${isMenuOpen ? 'active' : ''}`}>
        <li className="navbar-item">
          <Link to="/" onClick={() => { handleHomeClick(); setShowSidebar(false); setIsMenuOpen(false); }}>Trang chủ</Link>
        </li>
        <li className="navbar-item">
          <Link to="/infor" onClick={() => { handleHomeClick(); setShowSidebar(false); setIsMenuOpen(false); }}>Thông tin Giới thiệu</Link>
        </li>
        <li className="navbar-item">
          <Link to="/map" onClick={() => { handleHomeClick(); setShowSidebar(false); setIsMenuOpen(false); }}>Sơ Đồ Chung Cư và Bãi Đỗ</Link>
        </li>
        {isAuthenticated ? (
          <>
            {userRole === 'USER' && (
              <li className="navbar-item">
                <Link to="/userprofile" onClick={() => { handleUserOrAdminClick(); setShowSidebar(true); setIsMenuOpen(false); }}>Xe của tôi</Link>
              </li>
            )}
            {userRole === 'ADMIN' && (
              <li className="navbar-item">
                <Link to="/managevehiclesandusers" onClick={() => { handleUserOrAdminClick(); setShowSidebar(true); setIsMenuOpen(false); }}>Quản lý xe</Link>
              </li>
            )}
            <li className="navbar-item">
              <a href="#" onClick={handleLogout} className="navbar-link">Đăng xuất</a>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item"><Link to="/register" onClick={() => setIsMenuOpen(false)}>Đăng ký</Link></li>
            <li className="navbar-item"><Link to="/login" onClick={() => setIsMenuOpen(false)}>Đăng Nhập</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
