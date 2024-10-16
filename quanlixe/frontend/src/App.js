import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './view/Home';
import RegisterForm from './view/Register';
import backgroundImage from './img/anhnentrangchu.jpg';
import './css/App.css';
import Navbar from './view/Navbar';
import Footer from './view/Footer';
import LoginForm from './view/Login';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, [location]); // Theo dõi sự thay đổi của location để kiểm tra token

  return (
    <div className="App">
      <header className="App-header">
        <Navbar isAuthenticated={isAuthenticated} />
      </header>
      <main className="App-main">
        <img src={backgroundImage} className="App-background-image" alt="background" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/infor" element={<Infor />} />
          <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
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
        <Footer isAuthenticated={isAuthenticated} />
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
