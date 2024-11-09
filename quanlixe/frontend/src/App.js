// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
// import Home from './view/Home';
// import RegisterForm from './view/Register';
// import backgroundImage from './img/anhnentrangchu.jpg';
// import './css/App.css';
// import Navbar from './view/Navbar';
// import Footer from './view/Footer';
// import LoginForm from './view/Login';
// import User from './view/ViewEntity/User';
// import Admin from './view/ViewEntity/Admin';
// import Sidebar from './view/Sidebar';
// import Dashboard from './view/Dashboard';
// import ManageVehicles from './view/ViewAdmin/ManageVehicles';
// import ManageUsers from './view/ViewAdmin/ManageUsers';
// import ApproveVehicles from './view/ViewAdmin/ApproveVehicles';
// import AddVehicle from './view/ViewUser/AddVehicle';
// import MyVehicles from './view/ViewUser/MyVehicles';

// import Infor from './view/Infor';
// import Parkingstaus from './view/ParkingStatus' ;
// import Vehiclehistory from './view/VehicleHistory' ;
// import Parkingmap from './view/ParkingMap' ;
// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [role, setRole] = useState(null);
//   const [showSidebar, setShowSidebar] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userRole = localStorage.getItem('userRole');
//     if (token) {
//       setIsAuthenticated(true);
//       setRole(userRole);
//     } else {
//       setIsAuthenticated(false);
//       setRole(null);
//     }
//   }, [location]);

//   const handleHomeClick = () => {
//     setShowSidebar(false);
//     if (location.pathname !== '/') {
//       navigate('/');
//     }
//   };

//   const handleUserOrAdminClick = () => {
//     if (!showSidebar) {
//       setShowSidebar(true);
//     }
//   };

//   const toggleSidebar = () => {
//     setShowSidebar(prevState => !prevState);
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <Navbar isAuthenticated={isAuthenticated} handleHomeClick={handleHomeClick} handleUserOrAdminClick={handleUserOrAdminClick} setShowSidebar={setShowSidebar} />
//       </header>
//       <div className="App-body">
//         {isAuthenticated && showSidebar && <Sidebar role={role} />} 
//         <main className={`App-main ${isAuthenticated ? (showSidebar ? 'with-sidebar' : 'no-sidebar') : ''}`}>
//           <img src={backgroundImage} className="App-background-image" alt="background" />
//           <Routes>
//   <Route path="/" element={<Home handleHomeClick={handleHomeClick} />} />
//   <Route path="/infor" element={<Infor handleHomeClick={handleHomeClick} />} />
//   <Route path="/register" element={<RegisterForm />} />
//   <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
  
//   {/* Các route liên quan đến dashboard và quản lý */}
//   <Route path="/dashboard" element={<Dashboard />} />
//   <Route path="/parkingstatus" element ={< Parkingstaus/>} />
//   <Route path="/vehiclehistory" element={< Vehiclehistory/>} />
//   <Route path="/parkingmap" element={<Parkingmap/>} />
//   {/* Các route dành cho admin */}
//   <Route path="/managevehicles" element={<ManageVehicles />} />
//   <Route path="/manageusers" element={<ManageUsers />} />
//   <Route path="/approvevehicles" element={<ApproveVehicles />} />
  
//   {/* Các route dành cho user */}
//   <Route path="/addvehicle" element={<AddVehicle />} />
//   <Route path="/myvehicles" element={<MyVehicles />} />
// </Routes>

//         </main>
//       </div>
//       <footer >
//         <Footer isAuthenticated={isAuthenticated} />
//       </footer>
//     </div>
//   );
// }

// export default function AppWrapper() {
//   return (
//     <Router>
//       <App />
//     </Router>
//   );
// }
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
import VehicleHistory from './view/VehicleHistory';
import ParkingMap from './view/ParkingMap';
import ServiceAdmin from './view/ViewAdmin/ServiceAdmin';
import ServiceUser from './view/ViewUser/ServiceUser';
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
      '/parkingstatus', '/vehiclehistory', '/parkingmap', '/addvehicle', '/userprofile', '/myparkingstatus','/adminservice','/userservice','/adminservice'
    ];
    return isAuthenticated && sidebarPages.includes(location.pathname);
  };

  const shouldShowBackground = () => {
    return location.pathname === '/' || location.pathname === '/infor'|| location.pathname === '/login'|| location.pathname === '/register';
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

            {/* Các route liên quan đến dashboard và quản lý */}
            <Route path="/dashboard" element={<Dashboard />} />
           
            <Route path="/vehiclehistory" element={<VehicleHistory />} />
            <Route path="/parkingmap" element={<ParkingMap />} />

            {/* Các route dành cho admin */}
            <Route path="/parkingstatus" element={<ParkingStatus />} />
            <Route path="/managevehicles" element={<ManageVehicles />} />
            <Route path="/manageusers" element={<ManageUsers />} />
            <Route path="/approvevehicles" element={<ApproveVehicles />} />
            <Route path="/adminservice" element={<ServiceAdmin />} />
            {/* Các route dành cho user */}
            <Route path="/myparkingstatus" element={<MyParkingStatus />} />
            <Route path="/addvehicle" element={<AddVehicle />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/userservice" element={<ServiceUser />} />
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
