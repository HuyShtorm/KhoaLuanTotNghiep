
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './view/Home';
import RegisterForm from './view/Register';
import backgroundImage from './img/anhnentrangchu.jpg';
import './css/App.css';
import Navbar from './view/Navbar';
import Footer from './view/Footer';
import LoginForm from './view/Login';
import Dashboard from './view/Dashboard';
import Sidebar from './view/Sidebar';
import ManageVehicles from './view/ViewAdmin/ManageVehicles';
import ManageUsers from './view/ViewAdmin/ManageUsers';
import ApproveVehicles from './view/ViewAdmin/ApproveVehicles';
import UserProfile from './view/ViewUser/UserProfile';
import AddVehicle from './view/ViewUser/AddVehicle';
import Infor from './view/Infor';
import ParkingStatus from './view/ViewAdmin/ParkingStatus';
import MyParkingStatus from './view/ViewUser/MyParkingStatus';
import VehicleHistory from './view/ViewAdmin/VehicleHistory';
import MyVehicleHistory from './view/ViewUser/MyVehicleHistory';
import ParkingMap from './view/ParkingMap';
import ParkingServiceAdmin from './view/ViewAdmin/ParkingServiceAdmin';
import ParkingServiceUser from './view/ViewUser/ParkingServiceUser';
import ViewMap from './view/ViewMap';
import Invoice from './view/ViewAdmin/Invoice';
import MyInvoice from './view/ViewUser/MyInvoice';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, [location]);

  const handleHomeClick = () => {
    setShowSidebar(false);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleUserOrAdminClick = () => {
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  const shouldShowSidebar = () => {
    const sidebarPages = [
      '/dashboard', '/managevehicles', '/manageusers', '/approvevehicles',
      '/parkingstatus', '/vehiclehistory', '/myvehiclehistory','/parkingmap', '/addvehicle', '/userprofile', '/myparkingstatus','/adminservice','/invoice','/myinvoice','/parkinguserservice','/parkingadminservice'
    ];
    return isAuthenticated && sidebarPages.includes(location.pathname);
  };

  const shouldShowBackground = () => {
    return location.pathname === '/' || location.pathname === '/infor'|| location.pathname === '/map'|| location.pathname === '/login'|| location.pathname === '/register';
  };

  return (
    <div className="App">
      <header className="App-header">
        <Navbar 
          isAuthenticated={isAuthenticated}
          handleHomeClick={handleHomeClick}
          handleUserOrAdminClick={handleUserOrAdminClick}
          setShowSidebar={setShowSidebar}
        />
      </header>
      <div className="App-body">
        {shouldShowSidebar() && <Sidebar role={role} />}
        <main className={`App-main ${isAuthenticated ? (shouldShowSidebar() ? 'with-sidebar' : 'no-sidebar') : ''}`}>
          {shouldShowBackground() && <img src={backgroundImage} className="App-background-image" alt="background" />}
          <Routes>
            <Route path="/" element={<Home handleHomeClick={handleHomeClick} />} />
            <Route path="/infor" element={<Infor handleHomeClick={handleHomeClick} />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/map" element={<ViewMap handleHomeClick={handleHomeClick}/>} />  
            {/* Các route liên quan đến dashboard và quản lý */}
            <Route path="/dashboard" element={<Dashboard />} />
           
     
            <Route path="/parkingmap" element={<ParkingMap />} />

            {/* Các route dành cho admin */}
            <Route path="/parkingstatus" element={<ParkingStatus />} />
            <Route path="/managevehicles" element={<ManageVehicles />} />
            <Route path="/manageusers" element={<ManageUsers />} />
            <Route path="/approvevehicles" element={<ApproveVehicles />} />
            <Route path="/vehiclehistory" element={<VehicleHistory />} />
            <Route path="/parkingadminservice" element={<ParkingServiceAdmin />} />
            <Route path="/invoice" element={<Invoice />} />
            {/* Các route dành cho user */}
            <Route path="/myparkingstatus" element={<MyParkingStatus />} />
            <Route path="/addvehicle" element={<AddVehicle />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/myvehiclehistory" element={<MyVehicleHistory />} />
            <Route path="/myinvoice" element={<MyInvoice />} />
            <Route path="/parkinguserservice" element={<ParkingServiceUser />} />
          </Routes>
        </main>
      </div>
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
