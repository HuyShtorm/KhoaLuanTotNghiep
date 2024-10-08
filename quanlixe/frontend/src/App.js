import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Home from './view/Home';
import RegisterForm from './view/Register';
import backgroundImage from './img/anhnentrangchu.jpg';
import './css/App.css';
import Navbar from './view/Navbar';
import Footer from './view/Footer';
import LogForm from './view/Login';
import User from './view/ViewEntity/User';
import Admin from './view/ViewEntity/Admin';
import Infor from './view/Infor';
import UserManagement from './view/ViewAdmin/UserManagement';
import VehicleManagement from './view/ViewAdmin/VehicleManagement';
import Statistics from './view/ViewAdmin/Statistics';
import SystemConfig from './view/ViewAdmin/SystemConfig';
import Owner from './view/ViewEntity/Owner';
import Moderator from './view/ViewEntity/Moderator';
function App() {
  const [isUserPage, setIsUserPage] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra vai trò của người dùng sau khi load trang
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'ADMIN') {
      navigate('/admin');
    } else if (userRole === 'USER') {
      navigate('/user');
    }
  }, [navigate]);
  

  // Theo dõi sự thay đổi của route và cập nhật trạng thái tương ứng
  useEffect(() => {
    if (location.pathname.includes('/user')) {
      setIsUserPage(true);
      setIsAdminPage(false);
    } else if (location.pathname.includes('/admin')) {
      setIsUserPage(false);
      setIsAdminPage(true);
    } else {
      setIsUserPage(false);
      setIsAdminPage(false);
    }
  }, [location]);

  return (
    <div className="App">
      <header className="App-header">
        <Navbar isUserPage={isUserPage} isAdminPage={isAdminPage} />
      </header>
      <main className="App-main">
        {!isUserPage && !isAdminPage && (
          <img src={backgroundImage} className="App-background-image" alt="background" />
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterForm />} />
         <Route path="/infor" element={<Infor />} />

          <Route path="/login" element={<LogForm />} />
          <Route path="/user" element={<User />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/moderator" element={<Moderator />} />
          <Route path="admin/user-management" element={<UserManagement />} />
          <Route path="admin/vehicle-management" element={<VehicleManagement />} />
          <Route path="admin/statistics" element={<Statistics />} />
          <Route path="admin/system-config" element={<SystemConfig />} />
        </Routes>
      </main>
      <footer>
        <Footer isUserPage={isUserPage} isAdminPage={isAdminPage} />
      </footer>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
